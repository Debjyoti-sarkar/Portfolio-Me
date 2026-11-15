import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200×630 social card. Inline styles only (Satori subset). */
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0c0a09",
        color: "#f5f5f4",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#fb923c",
            color: "#1c1917",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          DS
        </div>
        <div style={{ fontSize: 28, color: "#a19a94", letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: title.length > 40 ? 64 : 80, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 32, color: "#b5aea8", lineHeight: 1.35 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a19a94" }}>
        <span>{site.name}</span>
        <span style={{ color: "#fb923c" }}>{site.role}</span>
      </div>
    </div>,
    ogSize,
  );
}
