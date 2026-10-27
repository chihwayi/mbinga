"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "USD" | "ZAR";

// Prices are stored per-variant as two independent, admin-set amounts
// (priceUsd and priceZar) rather than one converted via a live exchange
// rate — SA and Zimbabwe are priced separately on purpose. The currency
// toggle just selects which stored amount to read and display.
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("mbinga-currency");
    if (saved === "USD" || saved === "ZAR") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    localStorage.setItem("mbinga-currency", next);
  };

  const formatPrice = (amount: number) => {
    const symbol = currency === "USD" ? "$" : "R";
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
