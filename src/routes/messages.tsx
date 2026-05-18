import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { MobileShell } from "@/components/app/MobileShell";

export const Route = createFileRoute("/messages")({
  component: Messages,
});

function Messages() {
  return (
    <MobileShell>
      <div className="bg-surface px-4 pt-6 pb-4 border-b border-border">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>
      <div className="flex flex-col items-center justify-center px-8 pt-24 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--color-brand-soft)", color: "var(--color-brand)" }}
        >
          <MessageSquare className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold">No messages yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          When you book a pro, your chat will appear here.
        </p>
      </div>
    </MobileShell>
  );
}
