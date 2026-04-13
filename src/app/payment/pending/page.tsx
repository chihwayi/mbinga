import Link from "next/link";
import { Clock } from "lucide-react";

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams;

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-amber-400/10 flex items-center justify-center">
            <Clock className="text-amber-400" size={40} />
          </div>
        </div>

        <h1 className="font-serif text-4xl text-white mb-4">Payment Pending</h1>
        <p className="text-white/60 mb-2">
          Your payment is being processed. This may take a few minutes.
        </p>
        {order_id && (
          <p className="text-gold font-mono text-sm mb-8">
            Order ID: {order_id}
          </p>
        )}
        <p className="text-white/40 text-sm mb-12">
          Please do not close this window. We will notify you once your payment is confirmed.
        </p>

        <Link
          href="/"
          className="inline-block px-10 py-4 bg-obsidian border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}
