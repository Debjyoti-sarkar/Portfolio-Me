/**
 * Contact form contract, shared by the Next.js form (client-side validation)
 * and the `contact` Edge Function (authoritative server-side validation).
 * Keep this file dependency-free apart from zod so both runtimes can load it.
 */
import { z } from "zod";

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
  /** Humans take a few seconds to fill the form; bots submit instantly. */
  minFillMs: 3000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "Please enter your name.")
    .max(CONTACT_LIMITS.name.max, "That name is too long."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email.max, "That email is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "Please write at least a sentence.")
    .max(CONTACT_LIMITS.message.max, "Please keep it under 5,000 characters."),
  /** Honeypot: hidden from humans, must stay empty. */
  company: z.string().max(200).optional().default(""),
  /** ms timestamp when the form was rendered. */
  startedAt: z.number().int().nonnegative(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
