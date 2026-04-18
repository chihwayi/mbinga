import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { BOBPAY_CONFIG, createPaymentLink, generateOrderId } from '@/lib/bobpay'

interface CartItem {
  id:    string
  name:  string
  price: number
  quantity: number
  image: string
  slug:  string
}

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
    }: {
      items:           CartItem[]
      customerName:    string
      customerEmail:   string
      customerPhone:   string
      deliveryAddress: string
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // ─── Totals ───────────────────────────────────────────────────────────────
    const subtotal     = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryCost = 0  // update when delivery settings are configured
    const total        = subtotal + deliveryCost

    // ─── Order ID ─────────────────────────────────────────────────────────────
    const customPaymentId = generateOrderId()

    // ─── Item description ─────────────────────────────────────────────────────
    const itemDescription = items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ')

    // ─── Callback URLs ────────────────────────────────────────────────────────
    const baseUrl    =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.headers.get('x-forwarded-proto') ?? 'https'}://${request.headers.get('host')}`
    const notifyUrl  = `${baseUrl}/api/bobpay/webhook`
    const successUrl = `${baseUrl}/payment/success?order_id=${customPaymentId}`
    const pendingUrl = `${baseUrl}/payment/pending?order_id=${customPaymentId}`
    const cancelUrl  = `${baseUrl}/payment/cancel?order_id=${customPaymentId}`

    // ─── Save order (status: pending) ─────────────────────────────────────────
    const { error: dbError } = await supabase.from('orders').insert({
      custom_payment_id: customPaymentId,
      customer_name:     customerName,
      customer_email:    customerEmail,
      customer_phone:    customerPhone,
      delivery_address:  deliveryAddress,
      items:             items,
      subtotal:          subtotal,
      delivery_cost:     deliveryCost,
      total_amount:      total,
      currency:          'ZAR',
      status:            'pending',
      is_test:           BOBPAY_CONFIG.isSandbox,
    })

    if (dbError) {
      console.error('Failed to save order:', dbError)
    }

    // ─── Create BobPay payment link ───────────────────────────────────────────
    const bobpayResponse = await createPaymentLink({
      recipient_account_code: BOBPAY_CONFIG.accountCode,
      custom_payment_id:      customPaymentId,
      email:                  customerEmail,
      phone_number:           customerPhone,
      amount:                 total,
      item_name:              `MBINGA Order — ${customPaymentId}`,
      item_description:       itemDescription,
      notify_url:             notifyUrl,
      success_url:            successUrl,
      pending_url:            pendingUrl,
      cancel_url:             cancelUrl,
      transacting_as_email:   customerEmail,
      short_url:              false,
    })

    return NextResponse.json({
      paymentUrl:      bobpayResponse.url,
      customPaymentId: customPaymentId,
      total:           total,
    })
  } catch (error) {
    console.error('BobPay pay route error:', error)
    return NextResponse.json(
      { error: 'Payment initialization failed. Please try again.' },
      { status: 500 }
    )
  }
}
