import { Sparkles } from "lucide-react";

export function Splash({ tagline = "Trusted home services" }: { tagline?: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center text-white"
      style={{ background: "var(--color-brand)" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
          <Sparkles className="h-9 w-9 text-white" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold tracking-tight text-white">organid</p>
          <p className="mt-1 text-sm text-white/80">{tagline}</p>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
