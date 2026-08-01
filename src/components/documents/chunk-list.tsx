"use client";
import { Blocks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useChunks } from "@/lib/hooks/use-documents";

export function ChunkList({ documentId }: { documentId: string }) {
  const { data, isLoading } = useChunks(documentId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (!data || data.count === 0) {
    return (
      <EmptyState
        icon={Blocks}
        title="No chunks yet"
        description="Upload content to have the worker chunk and embed this document."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.items
        .slice()
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((chunk) => (
          <div key={chunk.id} className="rounded-lg border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="primary" className="font-mono">#{chunk.ordinal}</Badge>
              <Badge variant="outline" className="font-mono">{chunk.dimension}-d</Badge>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{chunk.text}</p>
          </div>
        ))}
    </div>
  );
}
