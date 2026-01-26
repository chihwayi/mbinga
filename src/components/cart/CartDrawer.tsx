"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-obsidian border-l border-gold/20 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex items-center justify-between bg-obsidian/95 backdrop-blur">
              <h2 className="text-2xl font-serif text-gold">Your Collection</h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gold/10 rounded-full transition-colors text-gold/60 hover:text-gold"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl text-gold/80">Your cart is empty</h3>
                  <p className="text-gray-400 max-w-xs">
                    Discover your signature scent from our exclusive collection.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-6 px-8 py-3 bg-obsidian border border-gold text-gold font-bold tracking-wider hover:bg-gold hover:text-obsidian transition-all duration-300"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-white/5 border border-gold/10 rounded-lg group hover:border-gold/30 transition-all duration-300"
                  >
                    <div className="relative w-20 h-20 bg-white/5 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-gold text-lg leading-tight">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          ${item.product.price}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1 border border-gold/10">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="text-gold/60 hover:text-gold transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="text-gold/60 hover:text-gold transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="font-bold text-gold/90">
                          ${item.product.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gold/10 bg-obsidian/95 backdrop-blur space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif text-gold">
                    <span>Total</span>
                    <span>${getCartTotal()}</span>
                  </div>
                </div>
                <Link 
                  href="/checkout"
                  onClick={toggleCart}
                  className="w-full py-4 bg-obsidian border border-gold text-gold font-bold tracking-[0.2em] hover:bg-gold hover:text-obsidian transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  CHECKOUT
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
