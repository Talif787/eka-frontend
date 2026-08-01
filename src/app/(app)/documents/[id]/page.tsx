"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/documents/status-badge";
import { ChunkList } from "@/components/documents/chunk-list";
import { UploadContentDialog } from "@/components/documents/upload-content-dialog";
import { useDocument } from "@/lib/hooks/use-document";
import { SOURCE_TYPE_LABELS, type SourceType } from "@/lib/config";
import { formatRelativeTime } from "@/lib/utils";

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={mono ? "break-all font-mono text-xs" : "text-sm"}>{value}</p>
    </div>
  );
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: doc, isLoading, isError } = useDocument(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/documents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Documents
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : isError || !doc ? (
        <EmptyState
          icon={AlertCircle}
          title="Document not found"
          description="It may have been deleted, or the ID is not valid for this workspace."
        />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{doc.title}</h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                <Badge variant="outline">{SOURCE_TYPE_LABELS[doc.source_type as SourceType] ?? doc.source_type}</Badge>
                <Badge variant="outline" className="font-mono">v{doc.version}</Badge>
              </div>
            </div>
            <UploadContentDialog documentId={doc.id} />
          </div>

          <Card>
            <CardContent className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
              <Field label="Document ID" value={doc.id} mono />
              <Field label="Collection ID" value={doc.collection_id} mono />
              <Field label="Source URI" value={doc.source_uri} mono />
              <Field label="Content hash" value={doc.content_hash} mono />
              <Field label="Registered" value={formatRelativeTime(doc.created_at)} />
              <Field label="Updated" value={formatRelativeTime(doc.updated_at)} />
            </CardContent>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold tracking-tight">Chunks</h3>
            </div>
            <Separator className="mb-4" />
            <ChunkList documentId={doc.id} />
          </div>
        </>
      )}
    </div>
  );
}
