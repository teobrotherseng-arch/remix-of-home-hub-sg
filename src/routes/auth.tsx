import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · Organid" },
      { name: "description", content: "Log in or create your Organid account." },
    ],
  }),
});

type Mode = "login" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const { user, ready, login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password);
      navigate({ to: "/" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background">
        {/* Header */}
        <div className="bg-foreground px-5 pt-10 pb-12 text-background rounded-b-[32px] shadow-pop">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--color-brand)" }}
            >
              <Sparkles className="h-4 w-4 text-brand-foreground" />
            </span>
            <span className="text-lg font-bold tracking-tight">organid</span>
          </div>
          <h1 className="mt-8 text-[26px] font-bold leading-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-background/70">
            {mode === "login"
              ? "Log in to book trusted home services."
              : "Sign up in seconds. No credit card required."}
          </p>
        </div>

        {/* Card */}
        <div className="-mt-6 px-4">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
              {(["login", "signup"] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className="rounded-full py-2 text-sm font-semibold transition"
                    style={{
                      background: active ? "var(--color-surface)" : "transparent",
                      color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                      boxShadow: active ? "var(--shadow-soft)" : "none",
                    }}
                  >
                    {m === "login" ? "Log in" : "Sign up"}
                  </button>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              {mode === "signup" && (
                <Field
                  Icon={UserIcon}
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
              )}
              <Field
                Icon={Mail}
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <Field
                Icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium"
                    style={{ color: "var(--color-brand)" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-brand-foreground shadow-soft disabled:opacity-60"
                style={{ background: "var(--color-brand)" }}
              >
                {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              <SocialButton label="Continue with Google" />
              <SocialButton label="Continue with Apple" />
            </div>

            <p className="mt-5 text-center text-[11px] text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/" className="underline">Terms</Link> &{" "}
              <Link to="/" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}

function Field({
  Icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  Icon: typeof Mail;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-3 focus-within:border-foreground/40">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold"
    >
      {label}
    </button>
  );
}
