import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone === "accent"
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-border bg-surface-muted text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
