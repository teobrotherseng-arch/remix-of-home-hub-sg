import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, CheckCircle2, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { PageHeader } from "@/components/app/PageHeader";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/service/$slug")({
  component: ServiceDetail,
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  return (
    <MobileShell showNav={false}>
      <PageHeader title={service.name} />
      <div className="px-4 pt-4">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{service.emoji}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-xs text-muted-foreground">{service.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span
                  className="inline-flex items-center gap-1 font-medium"
                  style={{ color: "var(--color-foreground)" }}
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    style={{ color: "var(--color-brand)" }}
                  />
                  {service.rating}
                  <span className="text-muted-foreground">
                    ({service.reviews.toLocaleString()})
                  </span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{service.bookings}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between rounded-2xl bg-secondary px-3 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Hourly rate
              </p>
              <p className="text-xl font-bold">
                S${service.hourlyRate}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / hr
                </span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Min. {service.minHours} hr
            </p>
          </div>
        </div>

        <section className="mt-5">
          <h3 className="mb-2 text-sm font-semibold">About</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </section>

        <section className="mt-5">
          <h3 className="mb-3 text-sm font-semibold">What's included</h3>
          <ul className="space-y-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--color-brand)" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 mb-6 rounded-2xl border border-border bg-brand-soft p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="h-5 w-5 shrink-0"
              style={{ color: "var(--color-brand)" }}
            />
            <div>
              <p className="text-sm font-semibold">Verified & insured</p>
              <p className="text-xs text-muted-foreground">
                Every pro is ID-verified, background-checked and covered by our
                service guarantee.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <Link
          to="/book/$slug"
          params={{ slug: service.slug }}
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-brand-foreground shadow-soft active:scale-[0.99]"
        >
          Continue to booking
        </Link>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </MobileShell>
  );
}
