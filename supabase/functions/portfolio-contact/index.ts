/**
 * POST /functions/v1/portfolio-contact
 *
 * Public contact-form endpoint. Pipeline:
 *   CORS allow-list → JSON size cap → zod validation → honeypot / timing
 *   checks → per-IP rate limit (salted hash) → insert via service role →
 *   email notification through Resend (optional; skipped if no API key).
 *
 * Env (set with `supabase secrets set` in production). Names are prefixed
 * with PORTFOLIO_ because function secrets are shared project-wide:
 *   PORTFOLIO_ALLOWED_ORIGINS          comma-separated site origins
 *   PORTFOLIO_RATE_LIMIT_SALT          random string used to hash IPs
 *   PORTFOLIO_RESEND_API_KEY           optional; enables the email notification
 *   PORTFOLIO_CONTACT_NOTIFY_TO        inbox that receives notifications
 *   PORTFOLIO_CONTACT_NOTIFY_FROM      verified Resend sender, e.g. "Portfolio <onboarding@resend.dev>"
 *   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.
 */
import { createClient } from "@supabase/supabase-js";
import { contactSchema } from "../_shared/contact-schema.ts";
import { clientIp, detectSpam, escapeHtml, hashIp, isAllowedOrigin } from "../_shared/contact-utils.ts";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_MESSAGES = Number(Deno.env.get("PORTFOLIO_RATE_LIMIT_MAX") ?? 3);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin, Deno.env.get("PORTFOLIO_ALLOWED_ORIGINS"));
  return {
    ...(allowed && origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function notify(name: string, email: string, message: string): Promise<void> {
  const apiKey = Deno.env.get("PORTFOLIO_RESEND_API_KEY");
  const to = Deno.env.get("PORTFOLIO_CONTACT_NOTIFY_TO");
  const from = Deno.env.get("PORTFOLIO_CONTACT_NOTIFY_FROM") ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.info("portfolio-contact: PORTFOLIO_RESEND_API_KEY/PORTFOLIO_CONTACT_NOTIFY_TO not set, skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New portfolio message from ${name.slice(0, 80)}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });
  if (!res.ok) console.error("portfolio-contact: Resend failed", res.status, await res.text());
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  if (!isAllowedOrigin(origin, Deno.env.get("PORTFOLIO_ALLOWED_ORIGINS"))) {
    return json({ error: "Origin not allowed" }, 403, origin);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413, origin);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, 422, origin);
  }
  const { name, email, message, company, startedAt } = parsed.data;

  // Bots get a normal-looking success so they don't learn to adapt.
  const verdict = detectSpam({ company, startedAt });
  if (verdict.spam) {
    console.info("portfolio-contact: dropped spam", verdict.reason);
    return json({ ok: true }, 200, origin);
  }

  const salt = Deno.env.get("PORTFOLIO_RATE_LIMIT_SALT");
  if (!salt) {
    console.error("portfolio-contact: PORTFOLIO_RATE_LIMIT_SALT is not set");
    return json({ error: "Server misconfigured" }, 500, origin);
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    db: { schema: "portfolio" },
    auth: { persistSession: false },
  });

  const ipHash = await hashIp(clientIp(req.headers), salt);
  const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();
  const { count, error: countError } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (countError) {
    console.error("portfolio-contact: rate-limit query failed", countError);
    return json({ error: "Something went wrong" }, 500, origin);
  }
  if ((count ?? 0) >= RATE_MAX_MESSAGES) {
    return new Response(JSON.stringify({ error: "Too many messages. Please try again later." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(RATE_WINDOW_MINUTES * 60),
        ...corsHeaders(origin),
      },
    });
  }

  const { error: insertError } = await supabase
    .from("contact_messages")
    .insert({ name, email, message, ip_hash: ipHash });
  if (insertError) {
    console.error("portfolio-contact: insert failed", insertError);
    return json({ error: "Something went wrong" }, 500, origin);
  }

  try {
    await notify(name, email, message);
  } catch (err) {
    // The message is safely stored; email is best-effort.
    console.error("portfolio-contact: notification error", err);
  }

  return json({ ok: true }, 200, origin);
});
