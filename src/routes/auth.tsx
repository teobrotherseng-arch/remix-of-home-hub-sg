import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo("Check your email to confirm your account, then log in.");
          setMode("login");
        } else {
          navigate({ to: "/" });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError("Google sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      if (result.redirected) return; // browser navigates away
      navigate({ to: "/" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-surface px-6 pt-12 pb-8">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--color-brand)" }}
          >
            <Sparkles className="h-5 w-5 text-brand-foreground" />
          </span>
          <span className="text-xl font-bold tracking-tight">organid</span>
        </div>

        <div className="mt-10">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login"
              ? "Log in to book trusted home services."
              : "Sign up in seconds. No credit card required."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
          {(["login", "signup"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setInfo(null);
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
          {info && (
            <p
              className="rounded-xl px-3 py-2 text-xs font-medium"
              style={{ background: "var(--color-brand-soft)", color: "var(--color-brand)" }}
            >
              {info}
            </p>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium"
                style={{ color: "var(--color-brand)" }}
              >
                Forgot password?
              </Link>
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
          <button
            type="button"
            onClick={googleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/" className="underline">Terms</Link> &{" "}
          <Link to="/" className="underline">Privacy Policy</Link>.
        </p>

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
