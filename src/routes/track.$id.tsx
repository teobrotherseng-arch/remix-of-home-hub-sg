import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, MessageSquare, Star, ShieldCheck, Check } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { PageHeader } from "@/components/app/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/track/$id")({
  component: Track,
});

type Booking = {
  id: string;
  service_slug: string;
  hours: number;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  status: string;
  total_cents: number;
  created_at: string;
};

const STEPS = [
  { key: "confirmed", label: "Booking confirmed" },
  { key: "matched", label: "Pro matched" },
  { key: "enroute", label: "On the way" },
  { key: "arrived", label: "Arrived" },
  { key: "done", label: "Service complete" },
];

function Track() {
  const { id } = Route.useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setBooking((data as Booking | null) ?? null);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const service = booking ? getService(booking.service_slug) : null;
  // Pretend progress based on age of booking (demo only)
  const minsSince = booking
    ? Math.floor((Date.now() - new Date(booking.created_at).getTime()) / 60000)
    : 0;
  const currentIndex = Math.min(4, Math.max(0, Math.floor(minsSince / 5)));
  const etaMinutes = Math.max(2, 18 - minsSince);

  return (
    <MobileShell showNav={false}>
      <PageHeader title={`Booking`} />

      {loading ? (
        <div className="px-4 pt-8 text-sm text-muted-foreground">Loading booking…</div>
      ) : !booking ? (
        <div className="px-4 pt-8">
          <p className="text-sm font-medium">Booking not found.</p>
          <Link
            to="/bookings"
            className="mt-3 inline-block rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-semibold"
          >
            See all bookings
          </Link>
        </div>
      ) : (
        <>
          <div className="px-4 pt-4">
            <div className="rounded-3xl bg-foreground p-5 text-background shadow-pop">
              <p className="text-[11px] uppercase tracking-wide text-background/60">
                {currentIndex < 4 ? "Your pro is on the way" : "Service complete"}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {currentIndex < 4 ? (
                  <>
                    ETA <span style={{ color: "var(--color-brand)" }}>{etaMinutes} min</span>
                  </>
                ) : (
                  "All done"
                )}
              </p>
              <p className="mt-1 text-xs text-background/70">
                {service?.name ?? "Service"} · {booking.hours} hr
              </p>

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

          <div className="px-4 pt-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold">
                SL
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold">Siti Lim</p>
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--color-brand)" }} />
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
                          done || active ? "var(--color-brand)" : "var(--color-border)",
                      }}
                    >
                      {done && <Check className="h-2.5 w-2.5 text-brand-foreground" />}
                    </span>
                    <p
                      className="text-sm"
                      style={{
                        fontWeight: active ? 600 : 500,
                        color:
                          done || active
                            ? "var(--color-foreground)"
                            : "var(--color-muted-foreground)",
                      }}
                    >
                      {s.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="px-4 pt-6">
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
              <Row
                label="Service"
                value={`${service?.name ?? booking.service_slug} · ${booking.hours} hr`}
              />
              <Row label="When" value={`${booking.scheduled_date} · ${booking.scheduled_time}`} />
              <Row label="Address" value={booking.address} />
              <Row label="Total" value={`S$${(booking.total_cents / 100).toFixed(2)}`} />
            </div>
          </section>

          <div className="px-4 pt-4 pb-6">
            <Link
              to="/bookings"
              className="block rounded-2xl border border-border bg-surface p-3 text-center text-sm font-medium"
            >
              See all bookings
            </Link>
          </div>
        </>
      )}
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
