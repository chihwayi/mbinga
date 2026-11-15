"use client";

import { useActionState, useState, useTransition } from "react";
import { DollarSign } from "lucide-react";
import { updateSettings } from "@/actions/settings";
import { recalculateAllPricing } from "@/actions/pricing";

interface PricingSettingsFormProps {
  marginPercent: string;
  prevailingRate: number;
}

export default function PricingSettingsForm({ marginPercent, prevailingRate }: PricingSettingsFormProps) {
  const [state, dispatch, isPending] = useActionState(updateSettings, undefined);
  const [isRecalculating, startRecalculate] = useTransition();
  const [recalcResult, setRecalcResult] = useState<string | null>(null);

  const handleRecalculate = () => {
    setRecalcResult(null);
    startRecalculate(async () => {
      const res = await recalculateAllPricing();
      setRecalcResult(
        res.success
          ? `Recalculated ${res.updated} size(s) at rate R${res.prevailingRate!.toFixed(2)}, margin ${res.marginPercent}%.`
          : res.error || "Failed."
      );
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md">
      <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
        <DollarSign size={20} className="text-gold" />
        USD/ZAR Pricing
      </h3>

      <p className="text-white/40 text-sm mb-4">
        Live rate right now: <span className="text-white/70">R{prevailingRate.toFixed(2)} per $1</span>.
        Product prices use this rate plus the margin below, rounded up to a clean figure with no cents.
      </p>

      <form action={dispatch} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Protection Margin (%)
          </label>
          <input
            type="number"
            name="usd_zar_margin_percent"
            step="0.5"
            min="0"
            max="30"
            required
            defaultValue={marginPercent}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors"
          />
        </div>

        {state === "success" && (
          <div className="text-green-400 text-sm">Margin updated successfully.</div>
        )}
        {state && state !== "success" && (
          <div className="text-red-400 text-sm">{state}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-obsidian border border-gold text-gold px-8 py-3 rounded-lg font-medium hover:bg-gold hover:text-obsidian transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Margin"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/40 text-sm mb-3">
          After changing the margin, re-apply it to every product's existing prices:
        </p>
        <button
          type="button"
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="border border-gold/40 text-gold px-6 py-3 rounded-lg text-sm font-medium hover:bg-gold/10 transition-colors disabled:opacity-50"
        >
          {isRecalculating ? "Recalculating…" : "Recalculate All Prices"}
        </button>
        {recalcResult && <p className="text-gold text-xs mt-3">{recalcResult}</p>}
      </div>
    </div>
  );
}
