"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { updateSettings } from "@/actions/settings";

interface ContactSettingsFormProps {
  contactEmail: string;
  contactWhatsapp: string;
}

export default function ContactSettingsForm({ contactEmail, contactWhatsapp }: ContactSettingsFormProps) {
  const [state, dispatch, isPending] = useActionState(updateSettings, undefined);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md">
      <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
        <Mail size={20} className="text-gold" />
        Contact Info
      </h3>

      <form action={dispatch} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            name="contact_email"
            required
            defaultValue={contactEmail}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="contact_whatsapp"
            required
            defaultValue={contactWhatsapp}
            placeholder="+27 66 457 0911"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors"
          />
        </div>

        {state === "success" && (
          <div className="text-green-400 text-sm">Contact info updated successfully.</div>
        )}
        {state && state !== "success" && (
          <div className="text-red-400 text-sm">{state}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-obsidian border border-gold text-gold px-8 py-3 rounded-lg font-medium hover:bg-gold hover:text-obsidian transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Contact Info"}
        </button>
      </form>
    </div>
  );
}
