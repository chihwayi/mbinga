"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import Image from "next/image";

function getCartImage(image: string, slug?: string) {
  let src = image || "";
  if (src.endsWith(".jpg")) src = src.replace(".jpg", ".png");
  if (slug === "uzoba-lit") src = "/images/unoziba-lit.png";
  return src;
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-serif text-gold mb-4">Your Cart is Empty</h1>
        <p className="text-white/60 mb-8">Add some items to your cart to proceed with checkout.</p>
        <Link href="/" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData  = new FormData(e.currentTarget);
    const customer  = formData.get("customer")  as string;
    const phone     = formData.get("phone")     as string;
    const email     = formData.get("email")     as string;
    const address   = formData.get("address")   as string;

    try {
      const res = await fetch('/api/bobpay/pay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items:           cart.map(i => ({
            id:       i.product.id,
            name:     i.product.name,
            price:    i.product.price,
            quantity: i.quantity,
            image:    i.product.image,
            slug:     i.product.slug,
          })),
          customerName:    customer,
          customerEmail:   email,
          customerPhone:   phone,
          deliveryAddress: address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed')
      }

      clearCart()
      window.location.href = data.paymentUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-gold mb-8 transition-colors">
            <ArrowLeft size={20} />
            Back to Shop
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-gold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form Section */}
            <div>
                <h2 className="text-2xl font-serif mb-6">Customer Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                        <input name="customer" required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors" placeholder="e.g. Farai Munetsi" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Phone Number</label>
                        <input name="phone" required type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors" placeholder="e.g. +263 77..." />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                        <input name="email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors" placeholder="e.g. farai@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Delivery Address</label>
                        <textarea name="address" required className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors h-32 resize-none" placeholder="Enter your full delivery address..." />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-obsidian text-gold border border-gold font-bold py-4 uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            "Redirecting to Payment..."
                        ) : (
                            <>
                                <CreditCard size={20} />
                                Proceed to Payment
                            </>
                        )}
                    </button>
                    <p className="text-center text-white/30 text-xs">
                        You will be redirected to BobPay&apos;s secure payment page to complete your order.
                    </p>
                </form>
            </div>

            {/* Order Summary Section */}
            <div className="bg-white/5 p-8 rounded-2xl h-fit border border-white/10">
                <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-white/5">
                                <Image
                                    src={getCartImage(item.product.image, item.product.slug)}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-white/40 text-sm">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-gold font-medium">
                                ${item.product.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-2">
                    <div className="flex justify-between text-white/60">
                        <span>Subtotal</span>
                        <span>${getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>Delivery</span>
                        <span>TBD</span>
                    </div>
                    <div className="flex justify-between text-xl font-serif text-gold pt-4 border-t border-white/10 mt-4">
                        <span>Total</span>
                        <span>${getCartTotal()}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
