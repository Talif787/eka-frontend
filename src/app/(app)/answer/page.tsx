"use client";
import * as React from "react";
import { AlertTriangle, MessagesSquare, Send, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnswerText } from "@/components/answer/answer-text";
import { GroundingRail } from "@/components/answer/grounding-rail";
import { useAnswerStream } from "@/lib/hooks/use-answer-stream";
import { useCitedSources } from "@/lib/hooks/use-cited-sources";

const TOP_K_OPTIONS = ["5", "8", "10", "15"];

export default function AnswerPage() {
  const [query, setQuery] = React.useState("");
  const [topK, setTopK] = React.useState("8");
  const [activeMarker, setActiveMarker] = React.useState<number | null>(null);

  const { status, answer, citations, flagged, error, query: asked, ask, reset } = useAnswerStream();
  const sources = useCitedSources(citations);
  const streaming = status === "streaming";

  function submit() {
    const q = query.trim();
    if (!q || streaming) return;
    setActiveMarker(null);
    ask({ query: q, top_k: Number(topK) });
  }

  const onSelect = React.useCallback((n: number) => {
    setActiveMarker(n);
    document.getElementById(`source-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const idle = status === "idle" && answer === "";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Answer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask a question and get a grounded answer, with every claim traceable to its source.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-3">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask anything about your documents..."
          rows={2}
          className="resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          autoFocus
        />
        <div className="flex items-center justify-between gap-2">
          <Select value={topK} onValueChange={setTopK}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOP_K_OPTIONS.map((k) => (
                <SelectItem key={k} value={k}>Top {k} sources</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {streaming ? (
            <Button variant="secondary" onClick={reset}>
              <Square className="size-3.5" /> Stop
            </Button>
          ) : (
            <Button onClick={submit} disabled={!query.trim()}>
              <Send className="size-4" /> Ask
            </Button>
          )}
        </div>
      </div>

      {idle ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <p className="font-display text-sm font-semibold">Grounded, cited answers</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Try &ldquo;How do new engineers get access?&rdquo; The answer streams in with citation
            markers you can trace to the exact passages on the right.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-4">
            {asked ? (
              <p className="flex items-start gap-2 text-sm font-medium">
                <MessagesSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {asked}
              </p>
            ) : null}

            {flagged ? (
              <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span className="text-foreground/80">
                  This answer may not be fully grounded in the retrieved sources. Check the citations
                  before relying on it.
                </span>
              </div>
            ) : null}

            <div className="rounded-xl border bg-card p-5">
              {answer === "" && streaming ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner /> Retrieving and grounding...
                </div>
              ) : (
                <AnswerText
                  text={answer}
                  streaming={streaming}
                  activeMarker={activeMarker}
                  onHover={setActiveMarker}
                  onSelect={onSelect}
                />
              )}
              {status === "error" ? (
                <p className="mt-3 text-sm text-destructive">{error}</p>
              ) : null}
            </div>
          </div>

          <GroundingRail
            sources={sources}
            pending={streaming}
            activeMarker={activeMarker}
            onHover={setActiveMarker}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
}
