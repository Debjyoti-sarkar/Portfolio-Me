"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

/** Route-level error boundary (renders inside the root layout). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 py-24 text-center">
      <div className="max-w-md">
        <p className="font-mono text-sm tracking-[0.2em] text-accent">500</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-4 text-fg-muted">
          An unexpected error occurred. Try again — if it keeps happening, the site may be updating.
        </p>
        {error.digest && <p className="mt-2 font-mono text-xs text-fg-subtle">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
