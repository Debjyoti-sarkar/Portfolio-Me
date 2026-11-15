"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, CONTACT_LIMITS, type ContactInput, type ContactPayload } from "@shared/contact-schema.ts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };

const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/portfolio-contact`;

/** Module-level so the React Compiler doesn't treat it as impure render work. */
const now = () => Date.now();
const blank = (): ContactInput => ({ name: "", email: "", message: "", company: "", startedAt: now() });

const fieldClass =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-subtle transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "", startedAt: 0 },
  });

  // Timestamp when the form became interactive (bots submit instantly).
  useEffect(() => setValue("startedAt", now()), [setValue]);

  async function onSubmit(values: ContactPayload) {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus({ kind: "success" });
        reset(blank());
        return;
      }
      const message =
        res.status === 429
          ? "You've sent a few messages already — please try again in a little while."
          : res.status === 422
            ? "Please check the highlighted fields."
            : "Something went wrong sending your message.";
      setStatus({ kind: "error", message });
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-8">
        <CheckCircle2 className="size-8 text-accent" aria-hidden="true" />
        <div>
          <p className="text-lg font-semibold">Message sent — thank you!</p>
          <p className="mt-1 text-fg-muted">I read everything and usually reply within a couple of days.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-describedby={status.kind === "error" ? `${id}-status` : undefined}
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name" error={errors.name?.message}>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={fieldClass}
            {...register("name")}
          />
        </Field>
        <Field id={`${id}-email`} label="Email" error={errors.email?.message}>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email.max}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={fieldClass}
            {...register("email")}
          />
        </Field>
      </div>
      <Field id={`${id}-message`} label="Message" error={errors.message?.message}>
        <textarea
          id={`${id}-message`}
          rows={5}
          maxLength={CONTACT_LIMITS.message.max}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className={cn(fieldClass, "resize-y")}
          placeholder="What are you working on?"
          {...register("message")}
        />
      </Field>

      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-status`} role="alert" className="text-sm text-red-700 dark:text-red-400">
          {status.kind === "error" ? status.message : ""}
        </p>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
