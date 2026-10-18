export interface ProductVariant {
  id: string;
  sizeMl: number;
  price: number;
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
