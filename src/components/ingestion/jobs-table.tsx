"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/documents/status-badge";
import { cn, shortId } from "@/lib/utils";
import type { JobResponse } from "@/lib/api/types";

export function JobsTable({ jobs }: { jobs: JobResponse[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead>Last error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const exhausted = job.attempts >= job.max_attempts;
            return (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{shortId(job.id)}</TableCell>
                <TableCell>
                  <Link
                    href={`/documents/${job.document_id}`}
                    className="font-mono text-xs text-muted-foreground hover:text-primary"
                  >
                    {shortId(job.document_id)}
                  </Link>
                </TableCell>
                <TableCell><StatusBadge status={job.status} /></TableCell>
                <TableCell className="text-right">
                  <span className={cn("font-mono text-xs tabular", exhausted ? "text-destructive" : "text-muted-foreground")}>
                    {job.attempts}/{job.max_attempts}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  {job.last_error ? (
                    <span className="flex items-center gap-1.5 text-xs text-destructive" title={job.last_error}>
                      <AlertTriangle className="size-3.5 shrink-0" />
                      <span className="truncate">{job.last_error}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
