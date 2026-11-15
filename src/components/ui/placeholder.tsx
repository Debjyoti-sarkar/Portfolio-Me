import { PencilLine } from "lucide-react";
import { cn, stripPlaceholder } from "@/lib/utils";

/**
 * Visible marker for content Deb still needs to provide. Rendered instead of
 * inventing copy; replace the PLACEHOLDER: text from /admin to remove it.
 */
export function Placeholder({ text, className, inline }: { text: string; className?: string; inline?: boolean }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      role="note"
      data-placeholder=""
      className={cn(
        "flex items-start gap-2 rounded-lg border border-dashed border-accent/50 bg-accent-soft/60 px-3 py-2 text-sm text-fg-muted",
        inline && "inline-flex",
        className,
      )}
    >
      <PencilLine className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <span>
        <strong className="font-semibold text-accent">Placeholder</strong> — {stripPlaceholder(text)}
      </span>
    </Tag>
  );
}
