import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const PLACEHOLDER_PREFIX = "PLACEHOLDER:";

/** Content still to be written by Deb is stored with a PLACEHOLDER: prefix. */
export function isPlaceholder(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trimStart().startsWith(PLACEHOLDER_PREFIX);
}

export function stripPlaceholder(value: string): string {
  return value.trimStart().slice(PLACEHOLDER_PREFIX.length).trim();
}

export type DatePrecision = "day" | "month" | "year";

/** Format an ISO date, never showing more precision than we actually know. */
export function formatDate(iso: string, precision: DatePrecision = "month"): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  const opts: Intl.DateTimeFormatOptions =
    precision === "year"
      ? { year: "numeric", timeZone: "UTC" }
      : precision === "month"
        ? { month: "short", year: "numeric", timeZone: "UTC" }
        : { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-GB", opts).format(date);
}

/** "Nov 2023 – Present" style ranges. Future end dates read as "(expected)". */
export function formatDateRange(start: string, end: string | null, now: Date = new Date()): string {
  const from = formatDate(start);
  if (!end) return `${from} – Present`;
  const to = formatDate(end);
  const expected = new Date(`${end}T00:00:00Z`) > now ? " (expected)" : "";
  return from === to ? from : `${from} – ${to}${expected}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** ~200 wpm reading time, minimum 1 minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type FilterableProject = { categories: string[]; tech: string[] };

/** AND-filter by category and tech; empty filter values match everything. */
export function filterProjects<T extends FilterableProject>(
  projects: readonly T[],
  filter: { category?: string | null; tech?: string | null },
): T[] {
  return projects.filter(
    (p) =>
      (!filter.category || p.categories.includes(filter.category)) && (!filter.tech || p.tech.includes(filter.tech)),
  );
}

/** Unique values ordered by how many projects use them, then alphabetically. */
export function facetCounts(values: readonly string[][]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const list of values) for (const v of list) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** Bucket a viewport width into a coarse, non-identifying device class. */
export function deviceClass(width: number): "mobile" | "tablet" | "desktop" {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Keep only the hostname of an external referrer; drop same-site and junk. */
export function referrerHost(referrer: string, ownHost: string): string | null {
  try {
    const host = new URL(referrer).hostname;
    return host && host !== ownHost ? host.slice(0, 255) : null;
  } catch {
    return null;
  }
}
