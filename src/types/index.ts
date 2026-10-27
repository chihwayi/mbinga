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
  createdAt?: Date;
  updatedAt?: Date;
}

// MBINGA lists sizes largest-first (100ml, then 50ml, then 35ml) — the
// reverse of aromatic-scents' ascending order.
export function sortVariantsBySize(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) => b.sizeMl - a.sizeMl);
}

// SA (Rand) and Zimbabwe (USD) are priced independently by the admin, not
// derived from each other via an exchange rate — pick the stored amount
// that matches the active currency.
export function getVariantPrice(variant: ProductVariant, currency: "USD" | "ZAR"): number {
  return currency === "ZAR" ? variant.priceZar : variant.priceUsd;
}
