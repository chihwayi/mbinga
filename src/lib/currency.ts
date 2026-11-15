// Protected pricing: instead of charging the raw live USD/ZAR rate, we pad
// it with an admin-adjustable margin, round the result UP to a clean,
// cash-friendly figure (no cents — Simba's clients pay cash and coins for
// fractional Rand/cents aren't practical), then quote a USD price derived
// back from that same clean Rand figure so neither currency shows awkward
// decimals.
//
// Example at a 6% margin, live rate ~16.13:
//   $100 * 16.13 * 1.06 = R1,709.78  -> rounded up -> R1,750
//   R1,750 / 16.13 = $108.49         -> rounded up -> $109

export function roundUpToCleanZar(amount: number): number {
  if (amount <= 0) return 0;
  const step = amount < 1000 ? 50 : 100;
  return Math.ceil(amount / step) * step;
}

export interface ProtectedPricing {
  priceZar: number;
  priceUsd: number;
}

// `usd` is the admin's target/reference price; `prevailingRate` is the live
// market USD/ZAR rate; `marginPercent` is the configurable upward buffer.
export function computeProtectedPricing(usd: number, prevailingRate: number, marginPercent: number): ProtectedPricing {
  const effectiveRate = prevailingRate * (1 + marginPercent / 100);
  const priceZar = roundUpToCleanZar(usd * effectiveRate);
  const priceUsd = Math.ceil(priceZar / prevailingRate);
  return { priceZar, priceUsd };
}
