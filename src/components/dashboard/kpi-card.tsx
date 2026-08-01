import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
  hint?: string;
}) {
  const toneClass = {
    default: "text-muted-foreground",
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn("size-4", toneClass)} />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular tracking-tight">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
