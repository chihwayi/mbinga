"use client";

import { useState } from "react";
import { applyBulkDiscount } from "@/actions/products";
import { X } from "lucide-react";

// Preset for the November launch promotion the client asked for: 30% off
// everything, running the whole month.
const NOVEMBER_PROMO = {
  percent: "30",
  startsAt: "2026-11-01T00:00",
  endsAt: "2026-11-30T23:59",
};

export default function BulkDiscountModal({ onClose }: { onClose: () => void }) {
  const [percent, setPercent] = useState(NOVEMBER_PROMO.percent);
  const [startsAt, setStartsAt] = useState(NOVEMBER_PROMO.startsAt);
  const [endsAt, setEndsAt] = useState(NOVEMBER_PROMO.endsAt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleApply = async () => {
    setIsSubmitting(true);
    setResult(null);
    const value = percent.trim() === "" ? null : Number(percent);
    const res = await applyBulkDiscount(value, startsAt || null, endsAt || null);
    setIsSubmitting(false);
    setResult(res.success ? `Applied to ${res.updated} product(s).` : res.error || "Failed.");
  };

  const handleClear = async () => {
    setIsSubmitting(true);
    setResult(null);
    const res = await applyBulkDiscount(null, null, null);
    setIsSubmitting(false);
    setResult(res.success ? `Cleared on ${res.updated} product(s).` : res.error || "Failed.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-obsidian border border-gold/30 rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif text-gold">Storewide Promotion</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <p className="text-white/40 text-sm">
          Applies the same discount to every product at once — defaults to the November launch promo (30% off, all month).
        </p>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-white/60 text-xs mb-1">Percent off</label>
            <input
              type="number"
              min="0"
              max="90"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Starts</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Ends</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        {result && <p className="text-xs text-gold">{result}</p>}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            disabled={isSubmitting}
            className="text-xs text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Clear all discounts
          </button>
          <button
            onClick={handleApply}
            disabled={isSubmitting}
            className="bg-obsidian border border-gold text-gold px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold hover:text-obsidian transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Applying…" : "Apply to All Products"}
          </button>
        </div>
      </div>
    </div>
  );
}
