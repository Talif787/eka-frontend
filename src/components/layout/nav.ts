import { FileText, ListChecks, MessagesSquare, Search, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
}

// Documents ships in F1. Search, Answer, and Ingestion land in later phases and
// are shown disabled so the shell reads as complete without dead links.
export const navItems: NavItem[] = [
  { label: "Documents", href: "/documents", icon: FileText, enabled: true },
  { label: "Search", href: "/search", icon: Search, enabled: true },
  { label: "Answer", href: "/answer", icon: MessagesSquare, enabled: true },
  { label: "Ingestion", href: "/ingestion", icon: ListChecks, enabled: false },
];
