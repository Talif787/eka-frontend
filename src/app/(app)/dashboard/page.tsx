"use client";
import Link from "next/link";
import { AlertCircle, CheckCircle2, FileText, Layers, Loader2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/documents/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useDocuments } from "@/lib/hooks/use-documents";
import { useJobs } from "@/lib/hooks/use-jobs";
import { formatRelativeTime } from "@/lib/utils";

const INDEXED = new Set(["indexed", "ready", "completed", "succeeded"]);
const ACTIVE = new Set(["queued", "pending", "processing", "in_progress"]);
const FAILED = new Set(["failed", "dead_letter"]);

function countBy<T>(items: T[], key: (t: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, it) => {
    const k = key(it);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

export default function DashboardPage() {
  const docsQuery = useDocuments({ limit: 100, offset: 0, sort_by: "created_at", sort_dir: "desc" });
  const jobsQuery = useJobs({ limit: 100 }, { refetchInterval: 6000 });

  if (docsQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (docsQuery.isError) {
    return (
      <div className="mx-auto max-w-6xl">
        <EmptyState icon={AlertCircle} title="Could not load the dashboard" description="Check that the API is reachable and try again." />
      </div>
    );
  }

  const docs = docsQuery.data;
  const jobs = jobsQuery.data?.items ?? [];
  const items = docs?.items ?? [];
  const total = docs?.meta.total ?? 0;

  const indexed = items.filter((d) => INDEXED.has(d.status.toLowerCase())).length;
  const activeJobs = jobs.filter((j) => ACTIVE.has(j.status.toLowerCase())).length;
  const failedJobs = jobs.filter((j) => FAILED.has(j.status.toLowerCase())).length;
  const docStatuses = countBy(items, (d) => d.status.toLowerCase());
  const recent = items.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your knowledge base at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Documents" value={total} icon={FileText} tone="primary" />
        <KpiCard label="Indexed" value={indexed} icon={CheckCircle2} tone="success" hint="Searchable and citable" />
        <KpiCard label="Active ingestion" value={activeJobs} icon={Loader2} tone="warning" hint="Queued or processing" />
        <KpiCard label="Needs attention" value={failedJobs} icon={AlertCircle} tone={failedJobs > 0 ? "destructive" : "default"} hint="Failed or dead-letter" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="size-4 text-muted-foreground" />
            <h3 className="font-display text-sm font-semibold">Documents by status</h3>
          </div>
          {Object.keys(docStatuses).length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(docStatuses)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="font-mono text-sm tabular text-muted-foreground">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Recent documents</h3>
            <Link href="/documents" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing registered yet.</p>
          ) : (
            <div className="space-y-1">
              {recent.map((d) => (
                <Link
                  key={d.id}
                  href={`/documents/${d.id}`}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm">{d.title}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={d.status} />
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(d.created_at)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
