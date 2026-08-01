"use client";
import { usePathname } from "next/navigation";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { navItems } from "./nav";
import { useAuthStore } from "@/lib/auth/store";

export function Topbar() {
  const pathname = usePathname();
  const claims = useAuthStore((s) => s.claims);
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
