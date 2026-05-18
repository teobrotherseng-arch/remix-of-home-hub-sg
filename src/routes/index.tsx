import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock3,
  BadgeCheck,
  Wallet,
  CalendarPlus,
} from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { SERVICES } from "@/lib/services";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Hommy — Book trusted home services in Singapore" },
      {
        name: "description",
        content:
          "Book verified cleaners, handymen and plumbers in Singapore. Transparent hourly pricing, real-time tracking.",
      },
    ],
  }),
});

function Home() {
  return (
    <MobileShell>
      {/* Top bar */}
      <div className="bg-surface px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good evening</p>
            <p className="text-base font-semibold">Welcome back 👋</p>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold"
            aria-label="Profile"
          >
            HS
          </button>
        </div>

        {/* Location */}
        <button
          type="button"
          className="mt-4 flex w-full items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5 text-left shadow-soft"
        >
          <MapPin className="h-4 w-4" style={{ color: "var(--color-brand)" }} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Service address
            </p>
            <p className="truncate text-sm font-medium">
              Blk 123 Tampines St 11, #08-21
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Search */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search cleaning, plumbing, fixes…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-5 text-background shadow-pop">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, var(--color-brand), transparent 70%)",
            }}
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 text-[11px] font-medium">
            <Sparkles className="h-3 w-3" /> New customer
          </span>
          <h2 className="mt-3 text-[22px] font-bold leading-tight">
            S$15 off your first<br />home cleaning
          </h2>
          <p className="mt-1 text-xs text-background/70">
            Verified pros · Transparent hourly pricing
          </p>
          <Link
            to="/service/$slug"
            params={{ slug: "cleaning" }}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground"
          >
            Book now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-base font-semibold">Services</h3>
          <span className="text-xs text-muted-foreground">3 categories</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/service/$slug"
              params={{ slug: s.slug }}
              className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-surface p-3 shadow-soft transition active:scale-[0.98]"
            >
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="text-sm font-semibold leading-tight">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  from S${s.hourlyRate}/hr
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-4 pt-6">
        <h3 className="mb-3 text-base font-semibold">Quick actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <QuickAction
            Icon={CalendarPlus}
            title="Rebook last"
            sub="2.5 hr cleaning"
          />
          <QuickAction Icon={Clock3} title="Same-day slots" sub="Today, 8 pm" />
        </div>
      </section>

      {/* Active booking */}
      <section className="px-4 pt-6">
        <Link
          to="/track/$id"
          params={{ id: "HM-8421" }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-brand-soft p-4 shadow-soft"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold text-brand-foreground"
            style={{ background: "var(--color-brand)" }}
          >
            🧹
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-accent-foreground">
              Active booking
            </p>
            <p className="truncate text-sm font-semibold">
              Cleaner on the way · ETA 18 min
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-accent-foreground" />
        </Link>
      </section>

      {/* Trust */}
      <section className="px-4 pt-6">
        <h3 className="mb-3 text-base font-semibold">Why Hommy</h3>
        <div className="space-y-2">
          <Trust
            Icon={ShieldCheck}
            title="Verified professionals"
            sub="ID-checked, background-screened, insured"
          />
          <Trust
            Icon={Wallet}
            title="Transparent hourly pricing"
            sub="No hidden fees. Pay only for time used."
          />
          <Trust
            Icon={BadgeCheck}
            title="Quality guarantee"
            sub="Not happy? We'll make it right within 24 hr."
          />
        </div>
      </section>
    </MobileShell>
  );
}

function QuickAction({
  Icon,
  title,
  sub,
}: {
  Icon: typeof Clock3;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left shadow-soft"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft"
        style={{ color: "var(--color-brand)" }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}

function Trust({
  Icon,
  title,
  sub,
}: {
  Icon: typeof ShieldCheck;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-3 shadow-soft">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft"
        style={{ color: "var(--color-brand)" }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
