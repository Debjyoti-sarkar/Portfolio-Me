import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHost = supabaseUrl ? new URL(supabaseUrl) : null;

/**
 * Static (nonce-free) CSP so every public page stays prerendered and served
 * from the CDN. Next.js needs inline bootstrap scripts, hence 'unsafe-inline'
 * for script-src; everything else is locked to 'self' + our Supabase project.
 * See node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseHost ? ` ${supabaseHost.origin}` : ""}`,
  "font-src 'self'",
  `connect-src 'self'${supabaseHost ? ` ${supabaseHost.origin}` : ""}${isDev ? " ws:" : ""}`,
  `media-src 'self'${supabaseHost ? ` ${supabaseHost.origin}` : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {
    // A stray package-lock.json in the home directory would otherwise be picked as the root.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: supabaseHost.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseHost.hostname,
            port: supabaseHost.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Local Supabase runs on 127.0.0.1, which next/image blocks by default.
    dangerouslyAllowLocalIP: isDev || supabaseHost?.hostname === "127.0.0.1",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/resume", destination: "/resume.pdf", permanent: false }];
  },
};

export default nextConfig;
