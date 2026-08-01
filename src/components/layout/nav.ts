import {
  FileText,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Search,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, enabled: true },
  { label: "Documents", href: "/documents", icon: FileText, enabled: true },
  { label: "Search", href: "/search", icon: Search, enabled: true },
  { label: "Answer", href: "/answer", icon: MessagesSquare, enabled: true },
  { label: "Ingestion", href: "/ingestion", icon: ListChecks, enabled: true },
];
