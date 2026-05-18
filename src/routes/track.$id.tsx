import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageSquare, Star, ShieldCheck, Check } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/track/$id")({
  component: Track,
});

const STEPS = [
  { key: "confirmed", label: "Booking confirmed", time: "6:42 pm" },
  { key: "matched", label: "Pro matched", time: "6:44 pm" },
  { key: "enroute", label: "On the way", time: "7:02 pm" },
  { key: "arrived", label: "Arrived", time: "—" },
  { key: "done", label: "Service complete", time: "—" },
];

function Track() {
  const { id } = Route.useParams();
  const currentIndex = 2; // "on the way"

  return (
    <MobileShell showNav={false}>
      <PageHeader title={`Booking ${id}`} />

      {/* Hero status */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl bg-foreground p-5 text-background shadow-pop">
          <p className="text-[11px] uppercase tracking-wide text-background/60">
            Your pro is on the way
          </p>
          <p className="mt-1 text-3xl font-bold">
            ETA <span style={{ color: "var(--color-brand)" }}>18 min</span>
          </p>
          <p className="mt-1 text-xs text-background/70">
            Arriving by 7:20 pm · 2.5 hr cleaning
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background:
                    i <= currentIndex
                      ? "var(--color-brand)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Provider card */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold">
            SL
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold">Siti Lim</p>
              <ShieldCheck
                className="h-3.5 w-3.5"
                style={{ color: "var(--color-brand)" }}
              />
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Star
                className="h-3 w-3"
                fill="currentColor"
                style={{ color: "var(--color-brand)" }}
              />
              <span className="font-medium text-foreground">4.94</span>
              <span>· 612 jobs</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Call"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              aria-label="Message"
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-foreground"
              style={{ background: "var(--color-brand)" }}
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="px-4 pt-6">
        <h3 className="mb-3 text-sm font-semibold">Status timeline</h3>
        <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
          {STEPS.map((s, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <li key={s.key} className="relative">
                <span
                  className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background"
                  style={{
                    background:
                      done || active
                        ? "var(--color-brand)"
                        : "var(--color-border)",
                  }}
                >
                  {done && <Check className="h-2.5 w-2.5 text-brand-foreground" />}
                </span>
                <p
                  className="text-sm"
                  style={{
                    fontWeight: active ? 600 : 500,
                    color: done || active
                      ? "var(--color-foreground)"
                      : "var(--color-muted-foreground)",
                  }}
                >
                  {s.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.time}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Details */}
      <section className="px-4 pt-6">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <Row label="Service" value="Home cleaning · 2.5 hr" />
          <Row label="Address" value="Blk 123 Tampines St 11, #08-21" />
          <Row label="Total paid" value="S$73.00" />
        </div>
      </section>

      <div className="px-4 pt-4">
        <Link
          to="/bookings"
          className="block rounded-2xl border border-border bg-surface p-3 text-center text-sm font-medium"
        >
          Need help? Contact support
        </Link>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
