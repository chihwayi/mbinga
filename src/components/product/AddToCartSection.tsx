"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import clsx from "clsx";

export default function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setQuantity(1); // Reset to 1 after adding
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-obsidian/10">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "w-2 h-2 rounded-full",
            isOutOfStock ? "bg-red-500" : product.stock < 5 ? "bg-orange-500" : "bg-green-500"
          )}
        />
        <span className={clsx("text-sm tracking-wide", isOutOfStock ? "text-red-400" : "text-gray-500")}>
          {isOutOfStock
            ? "Out of Stock"
            : product.stock < 5
            ? `Only ${product.stock} left`
            : "In Stock"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="text-3xl font-serif text-obsidian">${product.price}</div>

        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center border border-obsidian/20 h-12">
              <button
                onClick={handleDecrement}
                className="w-10 h-full flex items-center justify-center text-obsidian/50 hover:text-gold hover:bg-obsidian/5 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="w-12 text-center font-medium text-obsidian">{quantity}</div>
              <button
                onClick={handleIncrement}
                className="w-10 h-full flex items-center justify-center text-obsidian/50 hover:text-gold hover:bg-obsidian/5 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={clsx(
              "h-12 px-8 uppercase tracking-widest font-semibold flex items-center gap-2 transition-all duration-300 border border-gold",
              isOutOfStock
                ? "bg-obsidian/10 text-obsidian/30 cursor-not-allowed border-none"
                : "bg-obsidian text-gold hover:bg-gold hover:text-obsidian"
            )}
          >
            {isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                Add to Cart <ShoppingBag size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
