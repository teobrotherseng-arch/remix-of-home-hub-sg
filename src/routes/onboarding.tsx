import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MapPin, User as UserIcon, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Set up your account · Organid" }] }),
});

const HOME_TYPES = ["HDB", "Condo", "Landed"] as const;
const INTERESTS = [
  { id: "cleaning", label: "🧹 Cleaning" },
  { id: "handyman", label: "🛠️ Handyman" },
  { id: "plumbing", label: "🔧 Plumbing" },
];

function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, ready, refreshProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [postal, setPostal] = useState("");
  const [homeType, setHomeType] = useState<(typeof HOME_TYPES)[number]>("HDB");
  const [interests, setInterests] = useState<string[]>(["cleaning"]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth" });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
    if (profile?.phone) setPhone(profile.phone);
    if (profile?.address_line1) setAddr1(profile.address_line1);
    if (profile?.address_line2) setAddr2(profile.address_line2);
    if (profile?.postal_code) setPostal(profile.postal_code);
  }, [profile]);

  async function finish(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        address_line1: addr1.trim() || null,
        address_line2: addr2.trim() || null,
        postal_code: postal.trim() || null,
        preferences: { home_type: homeType, interests },
        onboarded: true,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await refreshProfile();
    navigate({ to: "/" });
  }

  function next() {
    if (step === 1 && !fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (step === 2 && (!addr1.trim() || !postal.trim())) {
      setError("Please enter your address and postal code.");
      return;
    }
    setError(null);
    setStep((s) => (s + 1) as 1 | 2 | 3);
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col px-6 pt-10 pb-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-1.5 flex-1 rounded-full"
              style={{
                background: n <= step ? "var(--color-brand)" : "var(--color-border)",
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Step {step} of 3</p>

        <div className="mt-6 flex-1">
          {step === 1 && (
            <>
              <h1 className="text-[26px] font-bold leading-tight tracking-tight">
                What should we call you?
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your pros will see this name.
              </p>
              <div className="mt-6 space-y-3">
                <FieldWrap Icon={UserIcon}>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </FieldWrap>
                <FieldWrap Icon={UserIcon}>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </FieldWrap>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[26px] font-bold leading-tight tracking-tight">
                Where do you need service?
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We'll use this as your default service address.
              </p>
              <div className="mt-6 space-y-3">
                <FieldWrap Icon={MapPin}>
                  <input
                    type="text"
                    placeholder="Address line 1"
                    value={addr1}
                    onChange={(e) => setAddr1(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </FieldWrap>
                <FieldWrap Icon={MapPin}>
                  <input
                    type="text"
                    placeholder="Unit / floor (optional)"
                    value={addr2}
                    onChange={(e) => setAddr2(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </FieldWrap>
                <FieldWrap Icon={MapPin}>
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    inputMode="numeric"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </FieldWrap>

                <div className="pt-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Home type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {HOME_TYPES.map((t) => {
                      const active = t === homeType;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setHomeType(t)}
                          className="rounded-2xl border py-2.5 text-sm font-semibold"
                          style={{
                            borderColor: active ? "var(--color-brand)" : "var(--color-border)",
                            background: active ? "var(--color-brand)" : "var(--color-surface)",
                            color: active ? "white" : "var(--color-foreground)",
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-[26px] font-bold leading-tight tracking-tight">
                What are you most interested in?
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Pick one or more.</p>
              <div className="mt-6 space-y-2">
                {INTERESTS.map((opt) => {
                  const on = interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setInterests((cur) =>
                          on ? cur.filter((x) => x !== opt.id) : [...cur, opt.id],
                        )
                      }
                      className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left"
                      style={{
                        borderColor: on ? "var(--color-brand)" : "var(--color-border)",
                        background: on ? "var(--color-brand-soft)" : "var(--color-surface)",
                      }}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full border"
                        style={{
                          borderColor: on ? "var(--color-brand)" : "var(--color-border)",
                          background: on ? "var(--color-brand)" : "transparent",
                        }}
                      >
                        {on && <Check className="h-3.5 w-3.5 text-brand-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={finish}>
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-foreground shadow-soft"
              style={{ background: "var(--color-brand)" }}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-foreground shadow-soft disabled:opacity-60"
              style={{ background: "var(--color-brand)" }}
            >
              {saving ? "Saving…" : "Finish setup"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function FieldWrap({
  Icon,
  children,
}: {
  Icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-3 focus-within:border-foreground/40">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </label>
  );
}
