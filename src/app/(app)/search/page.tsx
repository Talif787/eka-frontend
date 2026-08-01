"use client";
import * as React from "react";
import { Search as SearchIcon, AlertCircle, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultCard } from "@/components/search/result-card";
import { useSearch } from "@/lib/hooks/use-search";
import { ApiError } from "@/lib/api/errors";

const TOP_K_OPTIONS = ["5", "8", "10", "15", "20"];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [topK, setTopK] = React.useState("8");
  const search = useSearch();

  function run() {
    const q = query.trim();
    if (!q) return;
    search.mutate({ query: q, top_k: Number(topK) });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Search</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Retrieve the most relevant passages across your indexed documents.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="Search your corpus..."
          className="flex-1"
          autoFocus
        />
        <Select value={topK} onValueChange={setTopK}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOP_K_OPTIONS.map((k) => (
              <SelectItem key={k} value={k}>Top {k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={search.isPending || !query.trim()}>
          {search.isPending ? <Spinner /> : <SearchIcon className="size-4" />}
          Search
        </Button>
      </div>

      {search.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : search.isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Search failed"
          description={search.error instanceof ApiError ? search.error.message : "Something went wrong. Try again."}
        />
      ) : search.data ? (
        search.data.results.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No matches"
            description="Nothing indexed matched that query. Try different wording, or register more documents."
          />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {search.data.results.length} passages for{" "}
              <span className="font-medium text-foreground">{search.data.query}</span>
            </p>
            {search.data.results.map((r, i) => (
              <ResultCard key={r.chunk_id} result={r} rank={i + 1} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="Search your knowledge base"
          description="Enter a query to retrieve the closest passages, ranked by relevance."
        />
      )}
    </div>
  );
}
