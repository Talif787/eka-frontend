"use client";
import * as React from "react";
import { AlertCircle, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentsTable } from "@/components/documents/documents-table";
import { RegisterDocumentDialog } from "@/components/documents/register-document-dialog";
import { useDocuments } from "@/lib/hooks/use-documents";
import { ApiError } from "@/lib/api/errors";
import { PAGE_SIZE } from "@/lib/config";

export default function DocumentsPage() {
  const [offset, setOffset] = React.useState(0);
  const { data, isLoading, isError, error, isFetching } = useDocuments({
    limit: PAGE_SIZE,
    offset,
    sort_by: "created_at",
    sort_dir: "desc",
  });

  const meta = data?.meta;
  const from = meta ? meta.offset + 1 : 0;
  const to = meta ? meta.offset + data!.items.length : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Documents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Register sources and track them from ingestion to ready.
          </p>
        </div>
        <RegisterDocumentDialog />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Could not load documents"
          description={error instanceof ApiError ? error.message : "Check that the API is reachable and try again."}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Register your first source to start building a searchable, citable corpus."
          action={<RegisterDocumentDialog />}
        />
      ) : (
        <>
          <DocumentsTable documents={data.items} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground tabular">
              {from}–{to} of {meta?.total ?? 0}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0 || isFetching}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta?.has_more || isFetching}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
