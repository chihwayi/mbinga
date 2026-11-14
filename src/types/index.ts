export type Collection = "prestige" | "breeze";

export const COLLECTION_LABELS: Record<Collection, string> = {
  prestige: "Prestige Collection",
  breeze: "Breeze Collection",
};

export interface ProductVariant {
  id: string;
  sizeMl: number;
  priceUsd: number;
  priceZar: number;
  stock: number;
  image?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  collection: Collection;
  notes: string[];
  ingredients: string[];
  image: string;
  accentColor: string;
  variants: ProductVariant[];
  discountPercent?: number | null;
  discountStartsAt?: Date | string | null;
  discountEndsAt?: Date | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// MBINGA lists sizes largest-first (100ml, then 50ml) — the reverse of
// aromatic-scents' ascending order.
export function sortVariantsBySize(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) => b.sizeMl - a.sizeMl);
}

// The admin only enters a USD price — the Rand amount is derived from it at
// a fixed rate (see src/lib/currency.ts) — pick the stored amount that
// matches the active currency.
export function getVariantPrice(variant: ProductVariant, currency: "USD" | "ZAR"): number {
  return currency === "ZAR" ? variant.priceZar : variant.priceUsd;
}

// Each size can have its own bottle photo; falls back to the product's
// primary image (the 100ml shot) when a variant doesn't have one set.
export function getVariantImage(product: { image: string }, variant: ProductVariant): string {
  return variant.image || product.image;
}
