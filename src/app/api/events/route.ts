import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Privacy-friendly analytics sink. Accepts only coarse, non-identifying
 * fields; never reads or stores IP, user agent or cookies.
 */
const eventSchema = z.object({
  event: z.enum(["page_view", "resume_download", "outbound_click"]),
  path: z.string().startsWith("/").max(300),
  referrer: z.string().max(255).nullable().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return new Response(null, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > 2048) return new Response(null, { status: 413 });

  let parsed;
  try {
    parsed = eventSchema.safeParse(JSON.parse(raw));
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!parsed.success) return new Response(null, { status: 422 });

  const { event, path, referrer, device } = parsed.data;
  const { error } = await createPublicClient()
    .from("analytics_events")
    .insert({ event, path: path.split(/[?#]/)[0]!, referrer_host: referrer ?? null, device: device ?? null });

  if (error) console.error("analytics insert failed", error.message);
  return new Response(null, { status: 204 });
}
