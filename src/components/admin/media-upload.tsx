"use client";

import { ImageUp, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm";
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Uploads straight to the public `portfolio-media` bucket. Storage RLS only lets the
 * admin write, so this works only for a signed-in admin session.
 */
export function MediaUpload({
  folder,
  onUploaded,
  label = "Upload",
}: {
  folder: string;
  onUploaded: (path: string) => void;
  label?: string;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) return setError("Max 10 MB.");
    setBusy(true);
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
    const path = `${folder}/${Date.now()}-${base}.${ext}`;
    const { error: uploadError } = await getBrowserClient()
      .storage.from("portfolio-media")
      .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    setBusy(false);
    if (uploadError) return setError(uploadError.message);
    onUploaded(path);
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <label
        htmlFor={id}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-sm text-fg hover:border-fg/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ImageUp className="size-4" aria-hidden="true" />
        )}
        {busy ? "Uploading…" : label}
        <input id={id} type="file" accept={ACCEPT} className="sr-only" onChange={onChange} disabled={busy} />
      </label>
      {error && (
        <span role="alert" className="text-xs text-red-700 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
