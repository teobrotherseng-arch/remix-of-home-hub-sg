import { Link, useLocation } from "@tanstack/react-router";
import { Home, CalendarCheck, MessageCircle, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/bookings", label: "Bookings", Icon: CalendarCheck },
  { to: "/messages", label: "Messages", Icon: MessageCircle },
  { to: "/account", label: "Account", Icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: active ? "var(--color-brand)" : undefined }}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span style={{ color: active ? "var(--color-brand)" : undefined }}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
