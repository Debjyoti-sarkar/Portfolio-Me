"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { deviceClass, referrerHost } from "@/lib/utils";

type EventName = "page_view" | "resume_download" | "outbound_click";

/** Fire-and-forget, cookie-less event. No IP/UA is stored server-side. */
export function track(event: EventName, path = window.location.pathname) {
  if (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
  )
    return;
  const body = JSON.stringify({
    event,
    path,
    referrer: referrerHost(document.referrer, window.location.hostname),
    device: deviceClass(window.innerWidth),
  });
  if (!navigator.sendBeacon?.("/api/events", new Blob([body], { type: "application/json" }))) {
    void fetch("/api/events", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/** Records page views on route change plus résumé downloads & outbound clicks. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || pathname.startsWith("/admin")) return;
    track("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a?.href) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname.endsWith(".pdf") && url.origin === window.location.origin) track("resume_download");
      else if (url.origin !== window.location.origin && url.protocol.startsWith("http")) track("outbound_click");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
