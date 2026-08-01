"use client";
import * as React from "react";
import { CitationMarker } from "./citation-marker";

const MARKER = /\[(\d+)\]/g;

// Renders the accumulating answer, turning [n] references into interactive
// citation markers. Parsing the full accumulated string each render (rather than
// per token) means a marker split across two token events still resolves once
// its closing bracket arrives.
export function AnswerText({
  text,
  streaming,
  activeMarker,
  onHover,
  onSelect,
}: {
  text: string;
  streaming: boolean;
  activeMarker: number | null;
  onHover: (n: number | null) => void;
  onSelect: (n: number) => void;
}) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    const n = Number(m[1] ?? "0");
    nodes.push(
      <CitationMarker key={key++} n={n} active={activeMarker === n} onHover={onHover} onSelect={onSelect} />,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(<span key={key++}>{text.slice(last)}</span>);

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
      {nodes}
      {streaming ? (
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-primary" />
      ) : null}
    </p>
  );
}
