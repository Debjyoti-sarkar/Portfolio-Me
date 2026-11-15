import { ogCard, ogSize } from "@/lib/og/card";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "Portfolio", title: site.name, subtitle: site.headline });
}
