"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, type ActionResult } from "../actions";
import { Button } from "@/components/ui/button";

const input =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-fg focus:border-accent focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signIn, null);
  const forbidden = useSearchParams().get("error") === "forbidden";
  const error = state && !state.ok ? state.error : forbidden ? "Please sign in with the admin account." : null;

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={input} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>
      <p role="alert" className="min-h-5 text-sm text-red-700 dark:text-red-400">
        {error}
      </p>
      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Sign in
      </Button>
    </form>
  );
}
