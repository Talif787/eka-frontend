"use client";
import { Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SourceCard } from "./source-card";
import type { EnrichedSource } from "@/lib/hooks/use-cited-sources";

// The provenance signature: the column of sources that back the answer. It
// populates the moment the sources event lands, before the prose finishes.
export function GroundingRail({
  sources,
  pending,
  activeMarker,
  onHover,
  onSelect,
}: {
  sources: EnrichedSource[];
  pending: boolean;
  activeMarker: number | null;
  onHover: (n: number | null) => void;
  onSelect: (n: number) => void;
}) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Layers className="size-4" />
        Sources
        {sources.length > 0 ? (
          <span className="font-mono text-xs">({sources.length})</span>
        ) : null}
      </div>

      {sources.length === 0 && pending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : sources.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
          Cited passages will appear here, each linked to the markers in the answer.
        </p>
      ) : (
        sources.map((s) => (
          <SourceCard
            key={s.marker}
            source={s}
            active={activeMarker === s.marker}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))
      )}
    </aside>
  );
}
