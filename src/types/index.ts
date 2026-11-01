export interface ProductVariant {
  id: string;
  sizeMl: number;
  priceUsd: number;
  priceZar: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
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

// MBINGA lists sizes largest-first (100ml, then 50ml, then 35ml) — the
// reverse of aromatic-scents' ascending order.
export function sortVariantsBySize(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) => b.sizeMl - a.sizeMl);
}

// The admin only enters a USD price — the Rand amount is derived from it at
// a fixed rate (see src/lib/currency.ts) — pick the stored amount that
// matches the active currency.
export function getVariantPrice(variant: ProductVariant, currency: "USD" | "ZAR"): number {
  return currency === "ZAR" ? variant.priceZar : variant.priceUsd;
}
