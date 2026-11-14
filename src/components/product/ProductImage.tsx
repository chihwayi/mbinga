"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getVariantImage } from "@/types";
import { useProductVariant } from "@/context/ProductVariantContext";

export default function ProductImage() {
  const { product, selectedVariant } = useProductVariant();
  const src = selectedVariant ? getVariantImage(product, selectedVariant) : product.image;

  return (
    <div className="relative w-full max-w-[420px] md:max-w-[640px] h-[55vh] md:h-[80vh] mx-auto drop-shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={`${product.name}${selectedVariant ? ` (${selectedVariant.sizeMl}ml)` : ""}`}
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
