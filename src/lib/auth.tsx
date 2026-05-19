import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postal_code: string | null;
  preferences: Record<string, unknown>;
  onboarded: boolean;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  ready: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        // defer to avoid blocking the auth callback
        setTimeout(() => {
          void loadProfile(sess.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) await loadProfile(sess.user.id);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    profile,
    ready,
    refreshProfile: async () => {
      if (session?.user) await loadProfile(session.user.id);
    },
    logout: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function displayName(profile: Profile | null, email?: string | null) {
  if (profile?.full_name?.trim()) return profile.full_name.trim().split(" ")[0];
  if (email) return email.split("@")[0];
  return "there";
}

export function initialsFrom(
  name: string | null | undefined,
  email: string | null | undefined,
) {
  const src = name?.trim() || email?.split("@")[0] || "U";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}
