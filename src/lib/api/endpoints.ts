import { apiFetch } from "./client";
import { API_PREFIX } from "@/lib/config";
import type {
  AnswerEvent,
  ChunkListResponse,
  ContentAcceptedResponse,
  DocumentListResponse,
  DocumentResponse,
  JobListResponse,
  SearchResponse,
  TokenResponse,
} from "./types";

export interface TokenBody {
  tenant_id: string;
  subject: string;
  roles: string[];
}

export function issueToken(body: TokenBody): Promise<TokenResponse> {
  // The token endpoint itself needs no bearer token.
  return apiFetch<TokenResponse>("/v1/auth/token", { method: "POST", body });
}

export type ListDocumentsParams = {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  collection_id?: string;
}

export function listDocuments(
  params: ListDocumentsParams,
  token: string,
): Promise<DocumentListResponse> {
  return apiFetch<DocumentListResponse>("/v1/documents", { token, query: params });
}

export function getDocument(id: string, token: string): Promise<DocumentResponse> {
  return apiFetch<DocumentResponse>(`/v1/documents/${id}`, { token });
}

export interface RegisterDocumentBody {
  collection_id: string;
  title: string;
  source_type: string;
  source_uri: string;
  content_hash: string;
}

export function registerDocument(
  body: RegisterDocumentBody,
  token: string,
): Promise<DocumentResponse> {
  return apiFetch<DocumentResponse>("/v1/documents", { method: "POST", body, token });
}

export function deleteDocument(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/v1/documents/${id}`, { method: "DELETE", token });
}

export function uploadContent(
  documentId: string,
  content: string,
  token: string,
): Promise<ContentAcceptedResponse> {
  return apiFetch<ContentAcceptedResponse>(`/v1/documents/${documentId}/content`, {
    method: "POST",
    body: { content },
    token,
  });
}

export function listChunks(documentId: string, token: string): Promise<ChunkListResponse> {
  return apiFetch<ChunkListResponse>(`/v1/documents/${documentId}/chunks`, { token });
}

export function listJobs(
  params: { status?: string; limit?: number; offset?: number },
  token: string,
): Promise<JobListResponse> {
  return apiFetch<JobListResponse>("/v1/ingestion/jobs", { token, query: params });
}

export interface SearchBody {
  query: string;
  top_k?: number;
  collection_id?: string;
}

export function search(body: SearchBody, token: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>("/v1/search", { method: "POST", body, token });
}

export interface AnswerBody {
  query: string;
  top_k?: number;
  collection_id?: string;
}

// Streams the SSE answer. Uses fetch + a reader rather than EventSource because
// the request is a POST with an Authorization header and a JSON body.
export async function* streamAnswer(
  body: AnswerBody,
  token: string,
  signal?: AbortSignal,
): AsyncGenerator<AnswerEvent> {
  const res = await fetch(`${API_PREFIX}/v1/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
      "X-EKA-Token": token,
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Answer stream failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // SSE frames are separated by a blank line.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const line = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;
      try {
        yield JSON.parse(payload) as AnswerEvent;
      } catch {
        // ignore malformed frame
      }
    }
  }
}
