import { Resend } from "resend";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailData {
  customPaymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string | null;
  items: OrderItem[];
  subtotal: number | null;
  deliveryCost: number | null;
  totalAmount: number;
}

function formatItemsList(items: OrderItem[]): string {
  return items
    .map((i) => `<li>${i.name} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}</li>`)
    .join("");
}

function buildOrderSummaryHtml(order: OrderEmailData): string {
  return `
    <ul>${formatItemsList(order.items)}</ul>
    <p><strong>Subtotal:</strong> $${(order.subtotal ?? 0).toFixed(2)}<br/>
    <strong>Delivery:</strong> $${(order.deliveryCost ?? 0).toFixed(2)}<br/>
    <strong>Total Paid:</strong> R${order.totalAmount.toFixed(2)}</p>
    <p><strong>Delivery Address:</strong><br/>${(order.address || "—").replace(/\n/g, "<br/>")}</p>
    <p><strong>Customer Phone:</strong> ${order.customerPhone || "—"}</p>
  `;
}

// Silently no-ops if RESEND_API_KEY isn't configured yet, so this can ship
// ahead of the account being set up without breaking checkout.
export async function sendOrderNotificationEmails(order: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping order notification emails");
    return;
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL || "MBINGA <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@mbinga.com";
  const summaryHtml = buildOrderSummaryHtml(order);

  try {
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: `New order ${order.customPaymentId} — R${order.totalAmount.toFixed(2)}`,
      html: `<h2>New paid order</h2><p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>${summaryHtml}`,
    });
  } catch (error) {
    console.error("Failed to send admin order notification email:", error);
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: order.customerEmail,
      subject: `Your MBINGA order ${order.customPaymentId} is confirmed`,
      html: `<h2>Thank you for your order!</h2><p>Here's a summary of what you ordered:</p>${summaryHtml}`,
    });
  } catch (error) {
    console.error("Failed to send customer order confirmation email:", error);
  }
}
