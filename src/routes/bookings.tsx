import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/bookings")({
  component: Bookings,
});

type BookingRow = {
  id: string;
  service_slug: string;
  hours: number;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_cents: number;
  created_at: string;
};

function Bookings() {
  const { user, ready } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id,service_slug,hours,scheduled_date,scheduled_time,status,total_cents,created_at")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setBookings((data as BookingRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, ready]);

  const today = new Date().toISOString().slice(0, 10);
  const active = bookings.filter((b) => b.scheduled_date >= today && b.status !== "completed");
  const past = bookings.filter((b) => !active.includes(b));

  return (
    <MobileShell>
      <div className="bg-surface px-4 pt-6 pb-4 border-b border-border">
        <h1 className="text-xl font-bold">Bookings</h1>
        <p className="text-xs text-muted-foreground">
          Track, rebook and review past services
        </p>
      </div>

      {loading ? (
        <p className="px-4 pt-6 text-sm text-muted-foreground">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="px-4 pt-10 text-center">
          <p className="text-sm font-medium">No bookings yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Book a service to see it here.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-2xl px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-soft"
            style={{ background: "var(--color-brand)" }}
          >
            Browse services
          </Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section className="px-4 pt-5">
              <h2 className="mb-2 text-sm font-semibold">Active</h2>
              {active.map((b) => (
                <BookingCard key={b.id} b={b} statusLabel="Upcoming" link />
              ))}
            </section>
          )}

          {past.length > 0 && (
            <section className="px-4 pt-6 pb-6">
              <h2 className="mb-2 text-sm font-semibold">Past</h2>
              {past.map((b) => (
                <BookingCard key={b.id} b={b} statusLabel="Completed" />
              ))}
            </section>
          )}
        </>
      )}
    </MobileShell>
  );
}

function BookingCard({
  b,
  statusLabel,
  link,
}: {
  b: BookingRow;
  statusLabel: string;
  link?: boolean;
}) {
  const svc = getService(b.service_slug);
  const sub = `${b.scheduled_date} · ${b.scheduled_time} · ${b.hours} hr`;
  const inner = (
    <>
      <span className="text-2xl">{svc?.emoji ?? "📋"}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{svc?.name ?? b.service_slug}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      {link ? (
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: "var(--color-brand-soft)", color: "var(--color-brand)" }}
        >
          {statusLabel}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          S${(b.total_cents / 100).toFixed(2)} <ChevronRight className="h-3 w-3" />
        </span>
      )}
    </>
  );
  return link ? (
    <Link
      to="/track/$id"
      params={{ id: b.id }}
      className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
    >
      {inner}
    </Link>
  ) : (
    <div className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      {inner}
    </div>
  );
}
