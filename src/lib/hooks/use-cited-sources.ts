"use client";
import { useQueries } from "@tanstack/react-query";
import { getDocument, listChunks } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import { queryKeys } from "@/lib/query/keys";
import type { Citation } from "@/lib/api/types";

export interface EnrichedSource {
  marker: number;
  documentId: string;
  chunkId: string;
  documentTitle: string | null;
  text: string | null;
  ordinal: number | null;
  loading: boolean;
}

// Citations arrive as bare ids. Fetch each cited document's metadata and chunks
// (deduplicated per document) so the grounding rail can show the actual passage
// and its source title.
export function useCitedSources(citations: Citation[]): EnrichedSource[] {
  const token = useAuthStore((s) => s.token);
  const docIds = Array.from(new Set(citations.map((c) => c.document_id)));

  const docQueries = useQueries({
    queries: docIds.map((id) => ({
      queryKey: queryKeys.document(id),
      queryFn: () => getDocument(id, token!),
      enabled: Boolean(token && id),
      staleTime: 60_000,
    })),
  });
  const chunkQueries = useQueries({
    queries: docIds.map((id) => ({
      queryKey: queryKeys.chunks(id),
      queryFn: () => listChunks(id, token!),
      enabled: Boolean(token && id),
      staleTime: 60_000,
    })),
  });

  const titleById = new Map<string, string | null>();
  const loadingById = new Map<string, boolean>();
  const chunkById = new Map<string, { text: string; ordinal: number }>();

  docIds.forEach((id, i) => {
    titleById.set(id, docQueries[i]?.data?.title ?? null);
    loadingById.set(id, Boolean(docQueries[i]?.isLoading || chunkQueries[i]?.isLoading));
    chunkQueries[i]?.data?.items.forEach((ch) => chunkById.set(ch.id, { text: ch.text, ordinal: ch.ordinal }));
  });

  return citations
    .slice()
    .sort((a, b) => a.marker - b.marker)
    .map((c) => {
      const chunk = chunkById.get(c.chunk_id);
      return {
        marker: c.marker,
        documentId: c.document_id,
        chunkId: c.chunk_id,
        documentTitle: titleById.get(c.document_id) ?? null,
        text: chunk?.text ?? null,
        ordinal: chunk?.ordinal ?? null,
        loading: loadingById.get(c.document_id) ?? false,
      };
    });
}
