import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    const existingLog = await prisma.webhookLog.findFirst({
      where: { eventId: payload.uuid, processed: true },
      select: { id: true },
    })

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
    const order = await prisma.order.findUnique({
      where: { customPaymentId: payload.custom_payment_id },
      select: { id: true, amount: true, status: true, items: true },
    })

    if (!order) {
      await logWebhook(payload, clientIp, ipValid, signatureValid, 'Order not found')
      return NextResponse.json({ status: 'order_not_found' })
    }

    const amountMatch = Math.abs(payload.paid_amount - Number(order.amount)) < 0.02

    // ─── 6. Update order + log webhook (atomic) ───────────────────────────────
    await prisma.$transaction([
      prisma.order.update({
        where: { customPaymentId: payload.custom_payment_id },
        data: {
          status:            payload.status,
          bobpayUuid:        payload.uuid,
          bobpayShortRef:    payload.short_reference,
          bobpayPaymentId:   String(payload.payment_id),
          paidAmount:        payload.paid_amount,
          paymentMethod:     payload.payment_method,
          fromBank:          payload.from_bank || null,
          isTest:            payload.is_test,
          webhookPayload:    JSON.stringify(payload),
          webhookReceivedAt: new Date(),
        },
      }),
      prisma.webhookLog.create({
        data: {
          source:         'bobpay',
          eventId:        payload.uuid || null,
          orderId:        order.id,
          status:         payload.status || null,
          payload:        JSON.stringify(payload),
          ipAddress:      clientIp,
          signatureValid: signatureValid,
          processed:      true,
          error:          amountMatch ? null : `Amount mismatch: expected ${order.amount}, got ${payload.paid_amount}`,
        },
      }),
    ])

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
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { items: true },
    })

    if (!order?.items) return

    let items: Array<{ id: string; quantity: number }> = []
    try {
      const parsed = JSON.parse(order.items)
      items = Array.isArray(parsed) ? parsed : []
    } catch {
      items = []
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } })
      if (product) {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: Math.max(0, product.stock - item.quantity) },
        })
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
    await prisma.webhookLog.create({
      data: {
        source:         'bobpay',
        eventId:        payload.uuid || null,
        orderId:        orderId || null,
        status:         payload.status || null,
        payload:        JSON.stringify(payload),
        ipAddress:      ip,
        signatureValid: sigValid,
        processed,
        error,
      },
    })
  } catch (e) {
    console.error('Failed to log webhook:', e)
  }
}
