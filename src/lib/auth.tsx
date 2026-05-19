import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  name: string;
  email: string;
  initials: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const KEY = "organid.auth.user";
const AuthContext = createContext<AuthContextValue | null>(null);

function toInitials(name: string, email: string) {
  const src = name.trim() || email;
  const parts = src.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) window.localStorage.setItem(KEY, JSON.stringify(u));
      else window.localStorage.removeItem(KEY);
    }
  };

  const value: AuthContextValue = {
    user,
    ready,
    login: async (email, _password) => {
      const name = email.split("@")[0] ?? "Friend";
      const u: AuthUser = { name, email, initials: toInitials("", email) };
      persist(u);
      return u;
    },
    signup: async (name, email, _password) => {
      const u: AuthUser = { name, email, initials: toInitials(name, email) };
      persist(u);
      return u;
    },
    logout: () => persist(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
