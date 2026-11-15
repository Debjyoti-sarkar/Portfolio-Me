"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fade-and-rise on first scroll into view.
 *
 * The server renders the hidden starting state, so visibility must never
 * depend on JS branching here (a different client tree would leave the
 * server's `opacity: 0` in place after hydration). Instead, globals.css
 * forces `[data-reveal]` visible for `prefers-reduced-motion: reduce`, and
 * the root layout does the same inside <noscript>.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
