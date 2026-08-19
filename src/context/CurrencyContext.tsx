"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "USD" | "ZAR";

// Prices stored on Product/cart items are always in this currency.
const BASE_CURRENCY: Currency = "USD";
const FALLBACK_USD_TO_ZAR = 18.5;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rate: number; // 1 USD = `rate` ZAR
  convert: (baseAmount: number) => number;
  formatPrice: (baseAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rate, setRate] = useState<number>(FALLBACK_USD_TO_ZAR);

  useEffect(() => {
    const saved = localStorage.getItem("mbinga-currency");
    if (saved === "USD" || saved === "ZAR") {
      setCurrencyState(saved);
    }
  }, []);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.usdToZar === "number") setRate(data.usdToZar);
      })
      .catch(() => {
        // keep fallback rate
      });
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    localStorage.setItem("mbinga-currency", next);
  };

  const convert = (baseAmount: number) => {
    if (currency === BASE_CURRENCY) return baseAmount;
    return BASE_CURRENCY === "USD" ? baseAmount * rate : baseAmount / rate;
  };

  const formatPrice = (baseAmount: number) => {
    const amount = convert(baseAmount);
    const symbol = currency === "USD" ? "$" : "R";
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, convert, formatPrice }}>
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
