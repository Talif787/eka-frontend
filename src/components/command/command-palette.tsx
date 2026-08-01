"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommandStore } from "@/lib/command/store";

interface Command {
  label: string;
  icon: LucideIcon;
  href: string;
  keywords?: string;
}

const COMMANDS: Command[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", keywords: "dashboard home" },
  { label: "Documents", icon: FileText, href: "/documents", keywords: "files sources register" },
  { label: "Search", icon: Search, href: "/search", keywords: "retrieve find passages" },
  { label: "Answer", icon: MessagesSquare, href: "/answer", keywords: "ask question chat cited" },
  { label: "Ingestion", icon: ListChecks, href: "/ingestion", keywords: "jobs queue embed" },
];

export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen, toggle } = useCommandStore();
  const [q, setQ] = React.useState("");
  const [i, setI] = React.useState(0);

  const results = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return COMMANDS;
    return COMMANDS.filter((c) => `${c.label} ${c.keywords ?? ""}`.toLowerCase().includes(query));
  }, [q]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
    }
  }, [open]);
  React.useEffect(() => setI(0), [q]);

  function run(cmd: Command) {
    setOpen(false);
    router.push(cmd.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setI((n) => Math.min(results.length - 1, n + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI((n) => Math.max(0, n - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = results[i];
      if (c) run(c);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[18%] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-2xl data-[state=open]:animate-slide-up">
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Go to..."
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</p>
            ) : (
              results.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.href}
                    type="button"
                    onClick={() => run(c)}
                    onMouseEnter={() => setI(idx)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      idx === i ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    {c.label}
                  </button>
                );
              })
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
