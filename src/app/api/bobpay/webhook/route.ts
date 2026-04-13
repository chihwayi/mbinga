import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  BOBPAY_CONFIG,
  verifyWebhookSignature,
  validatePayment,
  isValidBobPayIP,
  type BobPayWebhookPayload,
} from '@/lib/bobpay'

export async function POST(request: NextRequest) {
  let payload: BobPayWebhookPayload | null = null

  try {
    payload = await request.json() as BobPayWebhookPayload

    // ─── 1. Verify source IP ──────────────────────────────────────────────────
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || ''

    const ipValid = isValidBobPayIP(clientIp)
    if (!BOBPAY_CONFIG.isSandbox && !ipValid) {
      await logWebhook(payload, clientIp, false, false, 'Invalid IP')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ─── 2. Verify signature ──────────────────────────────────────────────────
    const signatureValid = verifyWebhookSignature(payload, BOBPAY_CONFIG.passphrase)
    if (!BOBPAY_CONFIG.isSandbox && !signatureValid) {
      await logWebhook(payload, clientIp, ipValid, false, 'Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // ─── 3. Idempotency ───────────────────────────────────────────────────────
    const { data: existingLog } = await supabase
      .from('webhook_logs')
      .select('id')
      .eq('event_id', payload.uuid)
      .eq('processed', true)
      .maybeSingle()

    if (existingLog) {
      return NextResponse.json({ status: 'already_processed' })
    }

    // ─── 4. Validate with BobPay ──────────────────────────────────────────────
    const isValid = await validatePayment(payload)
    if (!isValid) {
      await logWebhook(payload, clientIp, ipValid, signatureValid, 'BobPay validation failed')
      return NextResponse.json({ error: 'Payment validation failed' }, { status: 400 })
    }

    // ─── 5. Find order ────────────────────────────────────────────────────────
    const { data: order } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('custom_payment_id', payload.custom_payment_id)
      .maybeSingle()

    if (!order) {
      await logWebhook(payload, clientIp, ipValid, signatureValid, 'Order not found')
      return NextResponse.json({ status: 'order_not_found' })
    }

    const amountMatch = Math.abs(payload.paid_amount - Number(order.total_amount)) < 0.02

    // ─── 6. Update order ──────────────────────────────────────────────────────
    await supabase.from('orders').update({
      status:              payload.status,
      bobpay_uuid:         payload.uuid,
      bobpay_short_ref:    payload.short_reference,
      bobpay_payment_id:   payload.payment_id,
      paid_amount:         payload.paid_amount,
      payment_method:      payload.payment_method,
      from_bank:           payload.from_bank || null,
      is_test:             payload.is_test,
      webhook_payload:     payload,
      webhook_received_at: new Date().toISOString(),
    }).eq('custom_payment_id', payload.custom_payment_id)

    await logWebhook(
      payload, clientIp, ipValid, signatureValid,
      amountMatch ? null : `Amount mismatch: expected ${order.total_amount}, got ${payload.paid_amount}`,
      order.id, true
    )

    // ─── 7. Reduce stock on successful payment ────────────────────────────────
    if (payload.status === 'paid' && amountMatch) {
      await reduceStock(order.id)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    if (payload) await logWebhook(payload, '', false, false, `Exception: ${error}`)
    return NextResponse.json({ status: 'received' })
  }
}

async function reduceStock(orderId: string) {
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('items')
      .eq('id', orderId)
      .single()

    if (!order?.items) return

    const items = Array.isArray(order.items)
      ? order.items as Array<{ id: string; quantity: number }>
      : []

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single()

      if (product) {
        await supabase
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', item.id)
      }
    }
  } catch (error) {
    console.error('Error reducing stock:', error)
  }
}

async function logWebhook(
  payload:   BobPayWebhookPayload,
  ip:        string,
  ipValid:   boolean,
  sigValid:  boolean,
  error:     string | null = null,
  orderId?:  string,
  processed = false
) {
  try {
    await supabase.from('webhook_logs').insert({
      source:          'bobpay',
      event_id:        payload.uuid || null,
      order_id:        orderId || null,
      status:          payload.status || null,
      payload:         payload,
      ip_address:      ip,
      signature_valid: sigValid,
      processed,
      error,
    })
  } catch (e) {
    console.error('Failed to log webhook:', e)
  }
}
