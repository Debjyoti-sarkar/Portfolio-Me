import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

/** Consistent vertical rhythm + heading block for every page section. */
export function Section({ id, eyebrow, title, description, children, className, action }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-20 sm:py-28", className)}>
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="mb-3 font-mono text-xs tracking-[0.18em] text-accent uppercase">{eyebrow}</p>}
              <h2 id={headingId} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {title}
              </h2>
              {description && <div className="mt-4 text-lg text-pretty text-fg-muted">{description}</div>}
            </div>
            {action}
          </div>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>{children}</div>;
}
