"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <button
      onClick={() => setCurrency(currency === "USD" ? "ZAR" : "USD")}
      className="text-xs tracking-widest border border-gold/40 text-gold/80 hover:text-gold hover:border-gold px-2.5 py-1 transition-colors"
      aria-label={`Switch currency to ${currency === "USD" ? "ZAR" : "USD"}`}
    >
      {currency}
    </button>
  );
}
