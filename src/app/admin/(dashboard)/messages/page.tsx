import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { deleteMessage, setMessageRead } from "../../actions";

export const metadata: Metadata = { title: "Messages" };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminMessages() {
  const { supabase } = await requireAdmin();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      {(messages ?? []).length === 0 ? (
        <p className="text-fg-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {(messages ?? []).map((m) => (
            <li
              key={m.id}
              className={cn("rounded-xl border bg-surface p-4", m.read ? "border-border" : "border-accent/50")}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-accent" aria-label="Unread" />}
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="text-sm font-normal text-accent hover:underline">
                    {m.email}
                  </a>
                </p>
                <time dateTime={m.created_at} className="text-xs text-fg-subtle">
                  {dateFmt.format(new Date(m.created_at))}
                </time>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap text-fg-muted">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <form action={setMessageRead.bind(null, m.id, !m.read)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-fg-muted hover:bg-surface-muted hover:text-fg"
                  >
                    {m.read ? (
                      <Mail className="size-3.5" aria-hidden="true" />
                    ) : (
                      <MailOpen className="size-3.5" aria-hidden="true" />
                    )}
                    Mark as {m.read ? "unread" : "read"}
                  </button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-red-700 hover:bg-surface-muted dark:text-red-400"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
