import { Sparkles } from "lucide-react";

export function Splash({ tagline = "Trusted home services" }: { tagline?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground text-background">
      <div className="flex flex-col items-center gap-5">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-pop"
          style={{ background: "var(--color-brand)" }}
        >
          <Sparkles className="h-9 w-9 text-brand-foreground" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight">organid</p>
          <p className="mt-1 text-xs text-background/60">{tagline}</p>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background/70" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background/70" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background/70" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
