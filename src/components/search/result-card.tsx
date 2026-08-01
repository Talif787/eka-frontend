"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import { shortId } from "@/lib/utils";
import type { SearchResultItem } from "@/lib/api/types";

export function ResultCard({ result, rank }: { result: SearchResultItem; rank: number }) {
  // Scores from hybrid retrieval are relevance weights; clamp to a 0..1 bar for
  // a quick visual sense of strength while showing the exact value alongside.
  const pct = Math.max(0, Math.min(1, result.score)) * 100;
  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{rank}</span>
          <Link
            href={`/documents/${result.document_id}`}
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary"
          >
            <FileText className="size-3.5" /> doc {shortId(result.document_id)}
          </Link>
        </div>
        <span className="font-mono text-xs tabular text-muted-foreground">{result.score.toFixed(3)}</span>
      </div>
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p className="line-clamp-4 text-sm leading-relaxed text-foreground/90">{result.text}</p>
    </div>
  );
}
