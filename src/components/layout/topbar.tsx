"use client";
import { usePathname } from "next/navigation";
import { ScrollText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCommandStore } from "@/lib/command/store";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { navItems } from "./nav";
import { useAuthStore } from "@/lib/auth/store";

export function Topbar() {
  const pathname = usePathname();
  const claims = useAuthStore((s) => s.claims);
  const openCommand = useCommandStore((s) => s.setOpen);
  const current = navItems.find((n) => pathname.startsWith(n.href));

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 lg:hidden">
          <ScrollText className="size-4 text-primary" />
          <span className="font-display text-sm font-semibold">EKA</span>
        </span>
        <h1 className="font-display text-sm font-semibold tracking-tight">{current?.label ?? "Console"}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground sm:inline-flex"
          onClick={() => openCommand(true)}
        >
          <Search className="size-3.5" /> Search
          <Kbd>Ctrl K</Kbd>
        </Button>
        {claims?.tid ? (
          <Badge variant="outline" className="hidden font-mono sm:inline-flex">
            {claims.tid.slice(0, 8)}
          </Badge>
        ) : null}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
