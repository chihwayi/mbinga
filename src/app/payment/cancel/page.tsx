import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams;

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-400/10 flex items-center justify-center">
            <XCircle className="text-red-400" size={40} />
          </div>
        </div>

        <h1 className="font-serif text-4xl text-white mb-4">Payment Cancelled</h1>
        <p className="text-white/60 mb-2">
          Your payment was cancelled. No charges have been made.
        </p>
        {order_id && (
          <p className="text-white/30 font-mono text-xs mb-8">
            Reference: {order_id}
          </p>
        )}
        <p className="text-white/40 text-sm mb-12">
          Your cart items are still saved. You can return and try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="px-10 py-4 bg-obsidian border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-10 py-4 bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
