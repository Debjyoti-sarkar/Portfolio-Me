"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { deletePost, savePost } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import { postSchema, type PostFormInput, type PostFormOutput } from "@/lib/validation/admin";
import { Button } from "@/components/ui/button";
import { FormField, inputClass } from "./fields";
import { MediaUpload } from "./media-upload";

export function PostForm({
  id,
  defaults,
  mediaBase,
}: {
  id: string | null;
  defaults: PostFormInput;
  mediaBase: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleting, startDelete] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PostFormInput, unknown, PostFormOutput>({ resolver: zodResolver(postSchema), defaultValues: defaults });
  const slug = useWatch({ control, name: "slug" });

  async function onSubmit() {
    setServerError(null);
    setSaved(false);
    const result = await savePost(id, getValues());
    if (!result.ok) {
      setServerError(result.error);
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof PostFormInput, { message: messages[0] });
      }
      return;
    }
    setSaved(true);
    if (!id && result.id) router.replace(`/admin/notes/${result.id}` as never);
  }

  function insertImage(path: string) {
    const url = `${mediaBase}/${path}`;
    setValue("content", `${getValues("content")}\n\n![Describe this image](${url})\n`, { shouldDirty: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="title" label="Title" error={errors.title?.message}>
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
        <FormField id="slug" label="Slug" hint="URL: /notes/<slug>" error={errors.slug?.message}>
          <input id="slug" className={inputClass} aria-invalid={!!errors.slug} {...register("slug")} />
        </FormField>
        <FormField id="excerpt" label="Excerpt" error={errors.excerpt?.message} className="sm:col-span-2">
          <input id="excerpt" className={inputClass} {...register("excerpt")} />
        </FormField>
        <FormField id="tags" label="Tags" hint="Comma-separated" className="sm:col-span-2">
          <input id="tags" className={inputClass} {...register("tags")} />
        </FormField>
      </div>
      <FormField id="content" label="Content (Markdown)" error={errors.content?.message}>
        <textarea
          id="content"
          rows={22}
          className={`${inputClass} font-mono text-[0.8rem] leading-relaxed`}
          {...register("content")}
        />
      </FormField>
      <MediaUpload folder={`notes/${slug || "new"}`} label="Insert image" onUploaded={insertImage} />

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-bg/95 px-4 py-4 backdrop-blur">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("published")} className="accent-[var(--accent)]" /> Published
        </label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} {id ? "Save" : "Create note"}
        </Button>
        <p role="status" className="text-sm">
          {serverError ? (
            <span className="text-red-700 dark:text-red-400">{serverError}</span>
          ) : saved && !isDirty ? (
            <span className="text-fg-muted">Saved.</span>
          ) : null}
        </p>
        {id && (
          <Button
            variant="ghost"
            className="ml-auto text-red-700 dark:text-red-400"
            disabled={deleting}
            onClick={() => {
              if (confirm("Delete this note permanently?")) startDelete(async () => void (await deletePost(id)));
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
