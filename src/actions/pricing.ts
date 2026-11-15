"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getPrevailingUsdToZarRate } from "@/lib/exchangeRate";
import { computeProtectedPricing } from "@/lib/currency";
import { getSettings } from "@/actions/settings";

// Combines the live USD/ZAR rate with the admin-configured margin so both
// the product form's live preview and the actual save path compute pricing
// identically.
export async function getPricingRate(): Promise<{ prevailingRate: number; marginPercent: number }> {
  const [prevailingRate, settings] = await Promise.all([
    getPrevailingUsdToZarRate(),
    getSettings(),
  ]);
  const marginPercent = Number(settings.usd_zar_margin_percent) || 0;
  return { prevailingRate, marginPercent };
}

// Re-derives every variant's priceZar/priceUsd from its current priceUsd
// using the live rate and current margin — lets the admin re-apply updated
// pricing storewide whenever the margin or market rate has moved, without
// re-entering every product.
export async function recalculateAllPricing() {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const { prevailingRate, marginPercent } = await getPricingRate();

  const variants = await prisma.productVariant.findMany();
  await prisma.$transaction(
    variants.map(v => {
      // Always derive from the stable targetUsd anchor, never from a
      // previously-computed priceUsd — otherwise each recalculation would
      // compound the margin on top of the last one's output.
      const { priceZar, priceUsd } = computeProtectedPricing(v.targetUsd, prevailingRate, marginPercent);
      return prisma.productVariant.update({
        where: { id: v.id },
        data: { priceZar, priceUsd },
      });
    })
  );

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/product/[slug]", "page");
  return { success: true, updated: variants.length, prevailingRate, marginPercent };
}
