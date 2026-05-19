import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
  head: () => ({
    meta: [{ title: "Reset password · Organid" }],
  }),
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col px-6 pt-8 pb-8">
        <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-10">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight">
            Reset your password
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div
            className="mt-8 rounded-2xl p-4 text-sm"
            style={{ background: "var(--color-brand-soft)", color: "var(--color-brand)" }}
          >
            Check your inbox at <span className="font-semibold">{email}</span> for a reset link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <label className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-3 focus-within:border-foreground/40">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-foreground shadow-soft disabled:opacity-60"
              style={{ background: "var(--color-brand)" }}
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
