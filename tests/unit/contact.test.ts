import { describe, expect, it } from "vitest";
import { contactSchema, CONTACT_LIMITS } from "@shared/contact-schema.ts";
import { clientIp, detectSpam, escapeHtml, hashIp, isAllowedOrigin } from "@shared/contact-utils.ts";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hi Deb, I'd love to chat about a role.",
  company: "",
  startedAt: 1,
};

describe("contactSchema", () => {
  it("accepts and trims valid input", () => {
    const r = contactSchema.parse({ ...valid, name: "  Ada  " });
    expect(r.name).toBe("Ada");
  });
  it("rejects bad email, short message and oversize fields", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(CONTACT_LIMITS.message.max + 1) }).success).toBe(
      false,
    );
    expect(contactSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });
  it("defaults the honeypot to empty", () => {
    const { company, ...rest } = valid;
    expect(company).toBe("");
    expect(contactSchema.parse(rest).company).toBe("");
  });
});

describe("detectSpam", () => {
  const now = 1_000_000;
  it("flags a filled honeypot", () => {
    expect(detectSpam({ company: "ACME", startedAt: 0 }, now)).toEqual({ spam: true, reason: "honeypot" });
  });
  it("flags submissions faster than a human could type", () => {
    expect(detectSpam({ startedAt: now - 500 }, now)).toEqual({ spam: true, reason: "too-fast" });
  });
  it("flags timestamps from the future", () => {
    expect(detectSpam({ startedAt: now + 10 }, now)).toEqual({ spam: true, reason: "future-timestamp" });
  });
  it("passes a normal submission", () => {
    expect(detectSpam({ company: "", startedAt: now - 20_000 }, now)).toEqual({ spam: false });
  });
});

describe("escapeHtml", () => {
  it("neutralises markup in the notification email", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});

describe("isAllowedOrigin", () => {
  const list = "https://deb.vercel.app, http://localhost:3000/";
  it("matches exact origins, tolerating trailing slashes", () => {
    expect(isAllowedOrigin("https://deb.vercel.app", list)).toBe(true);
    expect(isAllowedOrigin("http://localhost:3000", list)).toBe(true);
  });
  it("rejects others and missing config", () => {
    expect(isAllowedOrigin("https://evil.example", list)).toBe(false);
    expect(isAllowedOrigin("https://deb.vercel.app.evil.example", list)).toBe(false);
    expect(isAllowedOrigin(null, list)).toBe(false);
    expect(isAllowedOrigin("https://deb.vercel.app", undefined)).toBe(false);
  });
});

describe("IP handling", () => {
  it("hashes deterministically with a salt and never returns the raw IP", async () => {
    const a = await hashIp("203.0.113.7", "salt");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).toBe(await hashIp("203.0.113.7", "salt"));
    expect(a).not.toBe(await hashIp("203.0.113.7", "other-salt"));
  });
  it("prefers proxy-set headers and never trusts a client-supplied first hop", () => {
    expect(clientIp(new Headers({ "cf-connecting-ip": "198.51.100.9", "x-forwarded-for": "1.2.3.4" }))).toBe(
      "198.51.100.9",
    );
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    // Spoofed "1.2.3.4" was sent by the client; the proxy appended the real address.
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" }))).toBe("203.0.113.7");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
