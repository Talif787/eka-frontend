import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/command/command-palette";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
          <Topbar />
        <CommandPalette />
          <main className="flex-1 px-5 py-6 sm:px-8">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
