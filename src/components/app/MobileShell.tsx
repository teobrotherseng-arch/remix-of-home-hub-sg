import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileShell({
  children,
  showNav = true,
  withPadding = true,
}: {
  children: ReactNode;
  showNav?: boolean;
  withPadding?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen max-w-[480px] bg-background">
        <main className={withPadding ? "pb-28" : "pb-0"}>{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
