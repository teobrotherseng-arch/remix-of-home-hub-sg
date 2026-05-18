import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { PageHeader } from "@/components/app/PageHeader";
import { getService, type Service } from "@/lib/services";

export const Route = createFileRoute("/book/$slug")({
  component: Book,
  loader: ({ params }): { service: Service } => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
});

const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

function Book() {
  const { service } = Route.useLoaderData();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [hours, setHours] = useState(service.minHours);
  const [dayOffset, setDayOffset] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [addons, setAddons] = useState<string[]>([]);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  const addonsTotal = service.addons
    .filter((a: Service["addons"][number]) => addons.includes(a.id))
    .reduce((s: number, a: Service["addons"][number]) => s + a.price, 0);
  const labour = hours * service.hourlyRate;
  const platform = 3;
  const total = labour + addonsTotal + platform;

  const canNext =
    step === 1 ? true : step === 2 ? Boolean(time) : true;

  function next() {
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
    else navigate({ to: "/track/$id", params: { id: "HM-8421" } });
  }

  return (
    <MobileShell showNav={false}>
      <PageHeader title={`Book ${service.name}`} back={`/service/${service.slug}`} />

      {/* Stepper */}
      <div className="flex items-center gap-2 px-4 pt-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
              style={
                n <= step
                  ? { background: "var(--color-brand)", color: "white" }
                  : { background: "var(--color-secondary)", color: "var(--color-muted-foreground)" }
              }
            >
              {n < step ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            {n < 3 && (
              <div
                className="h-1 flex-1 rounded-full"
                style={{
                  background:
                    n < step ? "var(--color-brand)" : "var(--color-border)",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="px-4 pb-2 pt-2 text-xs text-muted-foreground">
        Step {step} of 3 ·{" "}
        {step === 1 ? "Duration & extras" : step === 2 ? "Date & time" : "Review & pay"}
      </div>

      <div className="px-4 pb-40 pt-2">
        {step === 1 && (
          <>
            <Card title="How many hours?">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setHours((h: number) => Math.max(service.minHours, h - 0.5))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <p className="text-3xl font-bold">{hours}</p>
                  <p className="text-xs text-muted-foreground">hours</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHours((h: number) => Math.min(8, h + 0.5))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Min {service.minHours} hr · S${service.hourlyRate}/hr
              </p>
            </Card>

            <Card title="Add-ons" subtitle="Optional">
              <div className="space-y-2">
                {service.addons.map((a: Service["addons"][number]) => {
                  const on = addons.includes(a.id);
                  return (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() =>
                        setAddons((cur) =>
                          on ? cur.filter((x) => x !== a.id) : [...cur, a.id],
                        )
                      }
                      className="flex w-full items-center justify-between rounded-2xl border bg-surface px-3 py-3 text-left"
                      style={{
                        borderColor: on
                          ? "var(--color-brand)"
                          : "var(--color-border)",
                        background: on ? "var(--color-brand-soft)" : undefined,
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          +S${a.price}
                        </p>
                      </div>
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full border"
                        style={{
                          borderColor: on
                            ? "var(--color-brand)"
                            : "var(--color-border)",
                          background: on ? "var(--color-brand)" : "transparent",
                        }}
                      >
                        {on && <Check className="h-3.5 w-3.5 text-brand-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Notes for your pro" subtitle="Optional">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Gate access, pet at home, special instructions…"
                className="w-full resize-none rounded-2xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <Card title="Choose a date">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d, i) => {
                  const active = i === dayOffset;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setDayOffset(i)}
                      className="flex min-w-[60px] flex-col items-center rounded-2xl border px-3 py-2 text-sm"
                      style={{
                        borderColor: active
                          ? "var(--color-brand)"
                          : "var(--color-border)",
                        background: active
                          ? "var(--color-brand)"
                          : "var(--color-surface)",
                        color: active ? "white" : "var(--color-foreground)",
                      }}
                    >
                      <span className="text-[11px] uppercase opacity-80">
                        {d.toLocaleDateString("en-SG", { weekday: "short" })}
                      </span>
                      <span className="text-base font-semibold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Available slots">
              <div className="grid grid-cols-3 gap-2">
                {TIMES.map((t) => {
                  const active = time === t;
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTime(t)}
                      className="rounded-2xl border py-2.5 text-sm font-medium"
                      style={{
                        borderColor: active
                          ? "var(--color-brand)"
                          : "var(--color-border)",
                        background: active
                          ? "var(--color-brand)"
                          : "var(--color-surface)",
                        color: active ? "white" : "var(--color-foreground)",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {step === 3 && (
          <>
            <Card title="Booking summary">
              <Row label="Service" value={service.name} />
              <Row label="Address" value="Blk 123 Tampines St 11" />
              <Row
                label="When"
                value={`${days[dayOffset].toLocaleDateString("en-SG", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })} · ${time ?? "—"}`}
              />
              <Row label="Duration" value={`${hours} hours`} />
            </Card>

            <Card title="Price breakdown">
              <Row
                label={`Labour · ${hours} hr × S$${service.hourlyRate}`}
                value={`S$${labour.toFixed(2)}`}
              />
              {addons.length > 0 && (
                <Row label="Add-ons" value={`S$${addonsTotal.toFixed(2)}`} />
              )}
              <Row label="Platform fee" value={`S$${platform.toFixed(2)}`} />
              <div className="mt-2 border-t border-border pt-3">
                <Row
                  label={<span className="text-sm font-semibold">Total</span>}
                  value={
                    <span className="text-base font-bold">
                      S${total.toFixed(2)}
                    </span>
                  }
                />
              </div>
            </Card>

            <Card title="Payment">
              <div className="flex items-center justify-between rounded-2xl border border-border px-3 py-3">
                <div>
                  <p className="text-sm font-medium">PayNow / Card</p>
                  <p className="text-xs text-muted-foreground">
                    Charged after service ends
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: "var(--color-brand-soft)",
                    color: "var(--color-brand)",
                  }}
                >
                  Default
                </span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="text-base font-bold">S${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-border text-sm font-semibold"
            >
              Back
            </button>
          )}
          <button
            type="button"
            disabled={!canNext}
            onClick={next}
            className="flex h-12 flex-[2] items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-brand-foreground disabled:opacity-50"
          >
            {step === 3 ? `Confirm & pay` : "Continue"}
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      {/* Hidden link to suppress unused import in some builds */}
      <Link to="/" className="hidden" aria-hidden />
    </MobileShell>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && (
          <span className="text-[11px] text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
