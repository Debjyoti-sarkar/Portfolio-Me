import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Required")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers and single dashes only");

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const optionalHttpsUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Must be an https:// URL")
  .transform((v) => (v === "" ? null : v))
  .nullable();

/** "a, b , ,c" → ["a","b","c"] (deduplicated, order preserved). */
export function parseList(input: string): string[] {
  return [
    ...new Set(
      input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

export const PROJECT_CATEGORIES = ["social-impact", "fintech", "ai-ml", "iot", "mobile", "web"] as const;

export const galleryItemSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().max(200),
  caption: z.string().trim().max(300).optional(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Required").max(120),
  slug,
  tagline: z.string().trim().min(1, "Required").max(200),
  summary: z.string().trim().min(1, "Required"),
  problem: optionalText,
  role: optionalText,
  architecture: optionalText,
  challenges: optionalText,
  results: optionalText,
  tech: z.string().transform(parseList),
  categories: z.array(z.enum(PROJECT_CATEGORIES)),
  social_impact: z.boolean(),
  featured: z.boolean(),
  award: optionalText,
  period: optionalText,
  credits: optionalText,
  github_url: optionalHttpsUrl,
  live_url: optionalHttpsUrl,
  cover_image: optionalText,
  gallery: z.array(galleryItemSchema).max(24),
  status: z.enum(["draft", "published"]),
  sort_order: z.coerce.number().int().min(0).max(10_000),
});

export type ProjectFormInput = z.input<typeof projectSchema>;
export type ProjectFormOutput = z.output<typeof projectSchema>;

export const postSchema = z.object({
  title: z.string().trim().min(1, "Required").max(160),
  slug,
  excerpt: z.string().trim().max(300),
  content: z.string(),
  tags: z.string().transform(parseList),
  cover_image: optionalText,
  published: z.boolean(),
});

export type PostFormInput = z.input<typeof postSchema>;
export type PostFormOutput = z.output<typeof postSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
