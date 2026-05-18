import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";

export const Route = createFileRoute("/account")({
  component: Account,
});

const ROWS = [
  { Icon: MapPin, label: "Saved addresses", sub: "2 addresses" },
  { Icon: CreditCard, label: "Payment methods", sub: "PayNow · Visa •• 4242" },
  { Icon: ShieldCheck, label: "Service guarantee", sub: "Learn how it works" },
  { Icon: HelpCircle, label: "Help & support", sub: "24/7 chat" },
];

function Account() {
  return (
    <MobileShell>
      <div className="bg-surface px-4 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-base font-semibold">
            HS
          </div>
          <div>
            <p className="text-base font-semibold">Hello, Sarah</p>
            <p className="text-xs text-muted-foreground">
              sarah@example.sg · Member since 2024
            </p>
          </div>
        </div>
      </div>

      <section className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          {ROWS.map(({ Icon, label, sub }, i) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft"
                style={{ color: "var(--color-brand)" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-destructive"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </section>
    </MobileShell>
  );
}
