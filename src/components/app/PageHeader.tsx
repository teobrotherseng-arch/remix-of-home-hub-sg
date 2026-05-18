import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  back = "/",
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-surface/90 px-3 py-3 backdrop-blur">
      <Link
        to={back}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1 className="flex-1 text-base font-semibold">{title}</h1>
      {right}
    </header>
  );
}
