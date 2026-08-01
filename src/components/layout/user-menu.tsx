"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/auth/store";

export function UserMenu() {
  const router = useRouter();
  const claims = useAuthStore((s) => s.claims);
  const clear = useAuthStore((s) => s.clear);
  const subject = claims?.sub ?? "user";
  const initials = subject.slice(0, 2).toUpperCase();

  function signOut() {
    clear();
    router.replace("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <div className="px-2 pb-2">
          <p className="text-sm font-medium">{subject}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{claims?.tid ?? "no tenant"}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(claims?.roles ?? []).map((r) => (
              <Badge key={r} variant="primary">{r}</Badge>
            ))}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive/10">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
