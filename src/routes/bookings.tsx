import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";

export const Route = createFileRoute("/bookings")({
  component: Bookings,
});

const ACTIVE = [
  {
    id: "HM-8421",
    title: "Home cleaning",
    sub: "Today · 7:00 pm · 2.5 hr",
    status: "On the way",
    emoji: "🧹",
  },
];

const PAST = [
  {
    id: "HM-8120",
    title: "Plumbing",
    sub: "12 May · Fixed kitchen leak",
    status: "Completed",
    emoji: "🔧",
  },
  {
    id: "HM-7903",
    title: "Handyman",
    sub: "28 Apr · TV mounting",
    status: "Completed",
    emoji: "🛠️",
  },
  {
    id: "HM-7611",
    title: "Home cleaning",
    sub: "10 Apr · 3 hr",
    status: "Completed",
    emoji: "🧹",
  },
];

function Bookings() {
  return (
    <MobileShell>
      <div className="bg-surface px-4 pt-6 pb-4 border-b border-border">
        <h1 className="text-xl font-bold">Bookings</h1>
        <p className="text-xs text-muted-foreground">
          Track, rebook and review past services
        </p>
      </div>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-semibold">Active</h2>
        {ACTIVE.map((b) => (
          <Link
            key={b.id}
            to="/track/$id"
            params={{ id: b.id }}
            className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
          >
            <span className="text-2xl">{b.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{b.title}</p>
              <p className="truncate text-xs text-muted-foreground">{b.sub}</p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                background: "var(--color-brand-soft)",
                color: "var(--color-brand)",
              }}
            >
              {b.status}
            </span>
          </Link>
        ))}
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-2 text-sm font-semibold">Past</h2>
        {PAST.map((b) => (
          <div
            key={b.id}
            className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
          >
            <span className="text-2xl">{b.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{b.title}</p>
              <p className="truncate text-xs text-muted-foreground">{b.sub}</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold"
            >
              Rebook <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </section>
    </MobileShell>
  );
}
