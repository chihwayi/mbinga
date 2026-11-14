"use client";

import { createContext, useContext, useState } from "react";
import { Product, ProductVariant, sortVariantsBySize } from "@/types";

interface ProductVariantContextType {
  product: Product;
  sortedVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  selectVariant: (variantId: string) => void;
}

const ProductVariantContext = createContext<ProductVariantContextType | undefined>(undefined);

// Shares the customer's size selection between the product image (left)
// and the Add to Cart section (right) so picking 50ml swaps both the photo
// and the price together, without lifting the whole page into one component.
export function ProductVariantProvider({ product, children }: { product: Product; children: React.ReactNode }) {
  const sortedVariants = sortVariantsBySize(product.variants);
  const [selectedVariantId, setSelectedVariantId] = useState(
    sortedVariants.find(v => v.stock > 0)?.id ?? sortedVariants[0]?.id
  );
  const selectedVariant = sortedVariants.find(v => v.id === selectedVariantId) ?? sortedVariants[0];

  return (
    <ProductVariantContext.Provider
      value={{ product, sortedVariants, selectedVariant, selectVariant: setSelectedVariantId }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  const context = useContext(ProductVariantContext);
  if (context === undefined) {
    throw new Error("useProductVariant must be used within a ProductVariantProvider");
  }
  return context;
}
