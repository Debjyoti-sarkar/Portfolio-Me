import { env } from "@/lib/env";

export type MediaBucket = "portfolio-media" | "portfolio-documents";

/**
 * Content stores either a Storage object path ("projects/hearme/cover.webp"),
 * a site-relative path ("/photo.jpg") or an absolute https URL.
 */
export function mediaUrl(path: string | null | undefined, bucket: MediaBucket = "portfolio-media"): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  const clean = path.split("/").map(encodeURIComponent).join("/");
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${clean}`;
}
