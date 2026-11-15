import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  // Only the production deployment should be indexed (not Vercel previews).
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: isProd ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] } : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
