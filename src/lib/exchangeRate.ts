// Live USD -> ZAR exchange rate, cached in-memory per server process. Used
// as the base for protected pricing (see src/lib/currency.ts) — a margin is
// layered on top so the final Rand price sits comfortably above the raw
// market conversion.
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const FALLBACK_USD_TO_ZAR = 17; // used only if the live API is unreachable

let cached: { rate: number; fetchedAt: number } | null = null;

export async function getPrevailingUsdToZarRate(): Promise<number> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`exchange rate API responded ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.ZAR;
    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      throw new Error('exchange rate API returned an invalid rate');
    }
    cached = { rate, fetchedAt: Date.now() };
    return rate;
  } catch (error) {
    console.error('Failed to fetch live USD/ZAR rate, using fallback:', error);
    return cached?.rate ?? FALLBACK_USD_TO_ZAR;
  }
}
