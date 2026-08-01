"use client";
import * as React from "react";
import { AlertCircle, ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsTable } from "@/components/ingestion/jobs-table";
import { useJobs } from "@/lib/hooks/use-jobs";
import { ApiError } from "@/lib/api/errors";

export default function IngestionPage() {
  const [status, setStatus] = React.useState("all");
  // Poll live, and filter client-side so we never depend on exact backend status
  // enum values in a query param.
  const { data, isLoading, isError, error, isFetching } = useJobs({ limit: 100 }, { refetchInterval: 4000 });

  const jobs = data?.items ?? [];
  const statuses = Array.from(new Set(jobs.map((j) => j.status.toLowerCase()))).sort();
  const filtered = status === "all" ? jobs : jobs.filter((j) => j.status.toLowerCase() === status);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Ingestion</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            Chunking and embedding jobs, updating live
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
          </p>
        </div>
        {statuses.length > 0 ? (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Could not load jobs"
          description={error instanceof ApiError ? error.message : "Check that the API is reachable."}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={jobs.length === 0 ? "No ingestion jobs yet" : "No jobs match this filter"}
          description={jobs.length === 0 ? "Upload content to a document and its ingestion job will appear here." : "Try a different status."}
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground tabular">
            {filtered.length} {filtered.length === 1 ? "job" : "jobs"}
            {isFetching ? " · refreshing" : ""}
          </p>
          <JobsTable jobs={filtered} />
        </>
      )}
    </div>
  );
}
