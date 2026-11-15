import { ExternalLink, FolderGit2, Inbox, LayoutDashboard, LogOut, NotebookPen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";

const nav = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/admin/notes", label: "Notes", Icon: NotebookPen },
  { href: "/admin/messages", label: "Messages", Icon: Inbox },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:px-6">
      <aside className="min-w-0 md:sticky md:top-8 md:self-start">
        <Link href="/admin" className="mb-6 flex items-center gap-2 font-semibold">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-fg font-mono text-xs text-bg"
          >
            DS
          </span>
          Admin
        </Link>
        <nav aria-label="Admin">
          <ul className="flex flex-wrap gap-1 md:flex-col md:flex-nowrap">
            {nav.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-fg-muted hover:bg-surface-muted hover:text-fg"
                >
                  <Icon className="size-4" aria-hidden="true" /> {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-fg-muted hover:bg-surface-muted hover:text-fg"
              >
                <ExternalLink className="size-4" aria-hidden="true" /> View site
              </Link>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<Skeleton className="mt-6 h-16 w-full" />}>
          <Account />
        </Suspense>
      </aside>
      <main id="main" className="min-w-0">
        <Suspense
          fallback={
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-40 w-full" />
            </div>
          }
        >
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </div>
  );
}

/** Every dashboard page renders only after the admin check passes. */
async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}

async function Account() {
  const { user } = await requireAdmin();
  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="truncate text-xs text-fg-subtle">{user.email}</p>
      <form action={signOut} className="mt-2">
        <button type="submit" className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <LogOut className="size-4" aria-hidden="true" /> Sign out
        </button>
      </form>
    </div>
  );
}
