import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams;

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center">
            <CheckCircle className="text-emerald-400" size={40} />
          </div>
        </div>

        <h1 className="font-serif text-4xl text-white mb-4">Payment Successful</h1>
        <p className="text-white/60 mb-2">
          Thank you for your order. Your payment has been confirmed.
        </p>
        {order_id && (
          <p className="text-gold font-mono text-sm mb-8">
            Order ID: {order_id}
          </p>
        )}
        <p className="text-white/40 text-sm mb-12">
          You will receive a confirmation once your order is dispatched.
        </p>

        <Link
          href="/"
          className="inline-block px-10 py-4 bg-obsidian border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
