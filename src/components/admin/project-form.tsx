"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { deleteProject, saveProject } from "@/app/admin/actions";
import { categoryLabels } from "@/lib/site";
import { slugify } from "@/lib/utils";
import {
  PROJECT_CATEGORIES,
  projectSchema,
  type ProjectFormInput,
  type ProjectFormOutput,
} from "@/lib/validation/admin";
import { Button } from "@/components/ui/button";
import { FormField, inputClass } from "./fields";
import { MediaUpload } from "./media-upload";

const longFields = [
  { name: "summary", label: "Overview", rows: 3 },
  { name: "problem", label: "The problem", rows: 4 },
  { name: "role", label: "My role", rows: 6 },
  { name: "architecture", label: "Architecture", rows: 6 },
  { name: "challenges", label: "Challenges", rows: 5 },
  { name: "results", label: "Results", rows: 4 },
] as const;

export function ProjectForm({
  id,
  defaults,
  mediaBase,
}: {
  id: string | null;
  defaults: ProjectFormInput;
  mediaBase: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleting, startDelete] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormInput, unknown, ProjectFormOutput>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaults,
  });
  const gallery = useFieldArray({ control, name: "gallery" });
  const cover = useWatch({ control, name: "cover_image" });
  const slug = useWatch({ control, name: "slug" });

  async function onSubmit() {
    setServerError(null);
    setSaved(false);
    // Send the raw input; the server re-validates with the same schema.
    const result = await saveProject(id, getValues());
    if (!result.ok) {
      setServerError(result.error);
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ProjectFormInput, { message: messages[0] });
      }
      return;
    }
    setSaved(true);
    if (!id && result.id) router.replace(`/admin/projects/${result.id}` as never);
  }

  const err = (name: keyof ProjectFormInput) => errors[name]?.message as string | undefined;
  const preview = (path: string) => (/^https?:|^\//.test(path) ? path : `${mediaBase}/${path}`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="title" label="Title" error={err("title")}>
          <input
            id="title"
            className={inputClass}
            aria-invalid={!!errors.title}
            {...register("title", {
              onBlur: (e) => {
                if (!getValues("slug")) setValue("slug", slugify(e.target.value), { shouldDirty: true });
              },
            })}
          />
        </FormField>
        <FormField id="slug" label="Slug" hint="URL: /projects/<slug>" error={err("slug")}>
          <input id="slug" className={inputClass} aria-invalid={!!errors.slug} {...register("slug")} />
        </FormField>
        <FormField id="tagline" label="Tagline" error={err("tagline")} className="sm:col-span-2">
          <input id="tagline" className={inputClass} aria-invalid={!!errors.tagline} {...register("tagline")} />
        </FormField>
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-semibold">Case study (Markdown)</legend>
        <p className="text-xs text-fg-subtle">
          Start any paragraph or bullet with <code>PLACEHOLDER:</code> to show a marked placeholder instead of content.
        </p>
        {longFields.map((f) => (
          <FormField key={f.name} id={f.name} label={f.label} error={err(f.name)}>
            <textarea
              id={f.name}
              rows={f.rows}
              className={`${inputClass} font-mono text-[0.8rem] leading-relaxed`}
              aria-invalid={!!errors[f.name]}
              {...register(f.name)}
            />
          </FormField>
        ))}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-semibold">Details</legend>
        <FormField id="tech" label="Tech stack" hint="Comma-separated" error={err("tech")} className="sm:col-span-2">
          <input id="tech" className={inputClass} {...register("tech")} />
        </FormField>
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium">Categories</p>
          <div className="flex flex-wrap gap-3">
            {PROJECT_CATEGORIES.map((c) => (
              <label key={c} className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" value={c} {...register("categories")} className="accent-[var(--accent)]" />
                {categoryLabels[c] ?? c}
              </label>
            ))}
          </div>
        </div>
        <FormField id="award" label="Award" error={err("award")}>
          <input id="award" className={inputClass} {...register("award")} />
        </FormField>
        <FormField id="period" label="Period" hint='e.g. "Nov 2025"' error={err("period")}>
          <input id="period" className={inputClass} {...register("period")} />
        </FormField>
        <FormField id="github_url" label="GitHub URL" error={err("github_url")}>
          <input
            id="github_url"
            type="url"
            className={inputClass}
            aria-invalid={!!errors.github_url}
            {...register("github_url")}
          />
        </FormField>
        <FormField id="live_url" label="Live URL" error={err("live_url")}>
          <input
            id="live_url"
            type="url"
            className={inputClass}
            aria-invalid={!!errors.live_url}
            {...register("live_url")}
          />
        </FormField>
        <FormField id="credits" label="Credits / attribution" error={err("credits")} className="sm:col-span-2">
          <input id="credits" className={inputClass} {...register("credits")} />
        </FormField>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("social_impact")} className="accent-[var(--accent)]" /> Social impact
            (listed first)
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="accent-[var(--accent)]" /> Featured on home page
          </label>
        </div>
        <FormField id="status" label="Status">
          <select id="status" className={inputClass} {...register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
        <FormField id="sort_order" label="Sort order" hint="Lower comes first" error={err("sort_order")}>
          <input id="sort_order" type="number" className={inputClass} {...register("sort_order")} />
        </FormField>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-semibold">Media</legend>
        <div className="flex flex-wrap items-center gap-4">
          {cover ? (
            <div className="relative aspect-video w-48 overflow-hidden rounded-lg border border-border">
              <Image src={preview(cover)} alt="Cover preview" fill sizes="192px" className="object-cover" />
            </div>
          ) : (
            <p className="text-sm text-fg-subtle">No cover image.</p>
          )}
          <MediaUpload
            folder={`projects/${slug || "new"}`}
            label="Upload cover"
            onUploaded={(p) => setValue("cover_image", p, { shouldDirty: true })}
          />
          {cover && (
            <Button variant="ghost" size="sm" onClick={() => setValue("cover_image", "", { shouldDirty: true })}>
              Remove cover
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Screenshots / demo</p>
          {gallery.fields.map((field, i) => (
            <div key={field.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
              <div className="relative aspect-video w-28 overflow-hidden rounded border border-border">
                <Image src={preview(field.src)} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <input
                aria-label={`Alt text for image ${i + 1}`}
                placeholder="Alt text (describe the image)"
                className={`${inputClass} flex-1`}
                {...register(`gallery.${i}.alt`)}
              />
              <input
                aria-label={`Caption for image ${i + 1}`}
                placeholder="Caption (optional)"
                className={`${inputClass} flex-1`}
                {...register(`gallery.${i}.caption`)}
              />
              <Button variant="ghost" size="sm" onClick={() => gallery.remove(i)} aria-label={`Remove image ${i + 1}`}>
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          <MediaUpload
            folder={`projects/${slug || "new"}/gallery`}
            label="Add screenshot"
            onUploaded={(p) => gallery.append({ src: p, alt: "", caption: "" })}
          />
        </div>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-bg/95 px-4 py-4 backdrop-blur">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{" "}
          {id ? "Save changes" : "Create project"}
        </Button>
        <p role="status" className="text-sm">
          {serverError ? (
            <span className="text-red-700 dark:text-red-400">{serverError}</span>
          ) : saved && !isDirty ? (
            <span className="text-fg-muted">Saved — the public site updates immediately.</span>
          ) : null}
        </p>
        {id && (
          <Button
            variant="ghost"
            className="ml-auto text-red-700 dark:text-red-400"
            disabled={deleting}
            onClick={() => {
              if (confirm("Delete this project permanently?")) startDelete(async () => void (await deleteProject(id)));
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
