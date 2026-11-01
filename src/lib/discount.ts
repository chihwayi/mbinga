import type { ProductVariant } from "@/types";
import type { Currency } from "@/context/CurrencyContext";
import { getVariantPrice } from "@/types";

export interface Discount {
  discountPercent?: number | null;
  discountStartsAt?: Date | string | null;
  discountEndsAt?: Date | string | null;
}

export function isDiscountActive(discount: Discount, now: Date = new Date()): boolean {
  if (!discount.discountPercent || discount.discountPercent <= 0) return false;
  if (discount.discountStartsAt && now < new Date(discount.discountStartsAt)) return false;
  if (discount.discountEndsAt && now > new Date(discount.discountEndsAt)) return false;
  return true;
}

export function applyDiscount(price: number, percent: number): number {
  return Math.round(price * (1 - percent / 100) * 100) / 100;
}

export interface VariantPricing {
  original: number;
  discounted: number;
  active: boolean;
  percent: number | null;
}

export function getVariantPricing(product: Discount, variant: ProductVariant, currency: Currency): VariantPricing {
  const original = getVariantPrice(variant, currency);
  const active = isDiscountActive(product);
  const discounted = active ? applyDiscount(original, product.discountPercent!) : original;
  return { original, discounted, active, percent: product.discountPercent ?? null };
}
