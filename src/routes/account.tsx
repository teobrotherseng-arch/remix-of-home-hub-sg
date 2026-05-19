import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, CreditCard, ShieldCheck, HelpCircle, LogOut, X, Check } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";
import { useAuth, initialsFrom } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const initials = initialsFrom(profile?.full_name, user?.email);
  const fullAddress = profile?.address_line1
    ? [profile.address_line1, profile.address_line2, profile.postal_code]
        .filter(Boolean)
        .join(", ")
    : "Add an address";

  return (
    <MobileShell>
      <div className="bg-surface px-4 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-base font-semibold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold">
              {profile?.full_name || "Add your name"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email ?? "Not signed in"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
          >
            Edit
          </button>
        </div>
      </div>

      <section className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <Row
            label="Service address"
            sub={fullAddress}
            onClick={() => setEditing(true)}
          />
          <Row Icon={CreditCard} label="Payment methods" sub="PayNow · Visa •• 4242" />
          <Row Icon={ShieldCheck} label="Service guarantee" sub="Learn how it works" />
          <Row Icon={HelpCircle} label="Help & support" sub="24/7 chat" />
        </div>
      </section>

      <section className="px-4 pt-4">
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate({ to: "/auth" });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-destructive"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </section>

      {editing && (
        <EditProfile
          onClose={() => setEditing(false)}
          onSaved={async () => {
            await refreshProfile();
            setEditing(false);
          }}
        />
      )}
    </MobileShell>
  );
}

function Row({
  Icon,
  label,
  sub,
  onClick,
}: {
  Icon?: typeof CreditCard;
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-left first:border-t-0"
    >
      {Icon && (
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft"
          style={{ color: "var(--color-brand)" }}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function EditProfile({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [addr1, setAddr1] = useState(profile?.address_line1 ?? "");
  const [addr2, setAddr2] = useState(profile?.address_line2 ?? "");
  const [postal, setPostal] = useState(profile?.postal_code ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function save() {
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
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[480px] rounded-t-3xl bg-surface p-5 pb-8 shadow-pop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <Input label="Full name" value={fullName} onChange={setFullName} />
          <Input label="Phone" value={phone} onChange={setPhone} type="tel" />
          <Input label="Address line 1" value={addr1} onChange={setAddr1} />
          <Input label="Unit / floor" value={addr2} onChange={setAddr2} />
          <Input label="Postal code" value={postal} onChange={setPostal} inputMode="numeric" />
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-foreground shadow-soft disabled:opacity-60"
          style={{ background: "var(--color-brand)" }}
        >
          {saving ? "Saving…" : (
            <>
              <Check className="h-4 w-4" /> Save changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-foreground/40"
      />
    </label>
  );
}
