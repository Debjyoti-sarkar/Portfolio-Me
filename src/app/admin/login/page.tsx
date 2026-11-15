import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid size-10 place-items-center rounded-xl bg-fg font-mono text-sm text-bg"
          >
            DS
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-fg-muted">Private dashboard — owner only.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
