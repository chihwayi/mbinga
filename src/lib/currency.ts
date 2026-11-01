// Fixed USD -> ZAR rate used for all pricing, set by the client rather than
// a live market rate, so the two currencies stay predictable and round
// (e.g. $50 -> R850) instead of drifting with daily fluctuations.
export const FIXED_USD_TO_ZAR_RATE = 17;

export function usdToZar(usd: number): number {
  return Math.round(usd * FIXED_USD_TO_ZAR_RATE * 100) / 100;
}
