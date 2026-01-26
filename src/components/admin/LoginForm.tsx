"use client";

import { useActionState, useEffect } from "react";
import { authenticate } from "@/actions/auth";
import { ArrowRight, Lock } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-obsidian border border-gold text-gold font-medium py-4 rounded-lg hover:bg-gold hover:text-obsidian transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
    >
      {pending ? "Authenticating..." : "Enter Portal"}
      {!pending && <ArrowRight size={16} />}
    </button>
  );
}

export default function LoginForm() {
  const [state, dispatch] = useActionState(authenticate, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state === "success") {
      router.push("/admin");
    }
  }, [state, router]);

  const errorMessage = state === "success" ? null : state;

  return (
    <form action={dispatch} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-gold">Email Access</label>
        <input
          type="email"
          name="email"
          placeholder="admin@mbinga.com"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-gold">Security Key</label>
        <div className="relative">
            <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
        </div>
      </div>

      <div className="pt-4">
        <LoginButton />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm text-center">{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
