"use client";
import Link from "next/link";
import { cn, shortId } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedSource } from "@/lib/hooks/use-cited-sources";

export function SourceCard({
  source,
  active,
  onHover,
  onSelect,
}: {
  source: EnrichedSource;
  active: boolean;
  onHover: (n: number | null) => void;
  onSelect: (n: number) => void;
}) {
  return (
    <div
      id={`source-${source.marker}`}
      onMouseEnter={() => onHover(source.marker)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(source.marker)}
      className={cn(
        "cursor-pointer rounded-lg border bg-card p-3.5 transition-colors",
        active ? "border-cite ring-1 ring-cite" : "hover:border-cite/40",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-[5px] font-mono text-[11px] font-semibold",
            active ? "bg-cite text-cite-foreground" : "bg-cite/15 text-cite",
          )}
        >
          {source.marker}
        </span>
        {source.ordinal !== null ? (
          <span className="font-mono text-[10px] text-muted-foreground">chunk #{source.ordinal}</span>
        ) : null}
      </div>

      {source.documentTitle ? (
        <Link
          href={`/documents/${source.documentId}`}
          onClick={(e) => e.stopPropagation()}
          className="line-clamp-1 text-sm font-medium hover:text-primary"
        >
          {source.documentTitle}
        </Link>
      ) : (
        <span className="font-mono text-xs text-muted-foreground">doc {shortId(source.documentId)}</span>
      )}

      {source.loading && source.text === null ? (
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ) : source.text ? (
        <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-muted-foreground">{source.text}</p>
      ) : (
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">chunk {shortId(source.chunkId)}</p>
      )}
    </div>
  );
}
