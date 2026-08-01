"use client";
import { cn } from "@/lib/utils";

// A footnote-style reference inside the streamed answer. Hovering or focusing it
// lights up the matching source card; the amber "cite" accent is reserved for
// exactly this provenance link.
export function CitationMarker({
  n,
  active,
  onHover,
  onSelect,
}: {
  n: number;
  active: boolean;
  onHover: (n: number | null) => void;
  onSelect: (n: number) => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(n)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(n)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(n)}
      aria-label={`Source ${n}`}
      className={cn(
        "mx-px inline-flex h-[15px] min-w-[15px] translate-y-[-2px] items-center justify-center rounded-[4px] px-1 align-super font-mono text-[10px] font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cite",
        active ? "bg-cite text-cite-foreground" : "bg-cite/15 text-cite hover:bg-cite/25",
      )}
    >
      {n}
    </button>
  );
}
