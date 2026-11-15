/**
 * Pure helpers for the contact pipeline. No runtime-specific APIs beyond Web
 * Crypto, so they run (and are unit-tested) in both Deno and Node.
 */
import { CONTACT_LIMITS } from "./contact-schema.ts";

/** Escape text for safe interpolation into the notification email's HTML. */
export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type SpamVerdict = { spam: false } | { spam: true; reason: "honeypot" | "too-fast" | "future-timestamp" };

/** Cheap bot filters that run before any database work. */
export function detectSpam(input: { company?: string; startedAt: number }, now: number = Date.now()): SpamVerdict {
  if (input.company && input.company.trim() !== "") return { spam: true, reason: "honeypot" };
  const elapsed = now - input.startedAt;
  if (elapsed < 0) return { spam: true, reason: "future-timestamp" };
  if (elapsed < CONTACT_LIMITS.minFillMs) return { spam: true, reason: "too-fast" };
  return { spam: false };
}

/** Parse a comma-separated origin allow-list and match a request origin. */
export function isAllowedOrigin(origin: string | null, allowList: string | undefined): boolean {
  if (!origin || !allowList) return false;
  const allowed = allowList
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return allowed.includes(origin.replace(/\/$/, ""));
}

/** Salted SHA-256 so raw IPs are never stored. */
export async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Best-effort client IP for rate limiting. Prefer headers that the edge
 * proxy overwrites (cf-connecting-ip, x-real-ip). X-Forwarded-For can be
 * pre-filled by the client, so only its LAST hop (appended by our proxy) is
 * trusted — never the first, which an attacker controls.
 */
export function clientIp(headers: Headers): string {
  const direct = headers.get("cf-connecting-ip") ?? headers.get("x-real-ip");
  if (direct) return direct.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1]!;
  }
  return "unknown";
}
