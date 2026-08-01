// TypeScript mirrors of the backend transport schemas. Kept in lockstep with
// the FastAPI Pydantic models so the client is a faithful contract.

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface DocumentResponse {
  id: string;
  tenant_id: string;
  collection_id: string;
  title: string;
  source_type: string;
  source_uri: string;
  content_hash: string;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PageMeta {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface DocumentListResponse {
  items: DocumentResponse[];
  meta: PageMeta;
}

export interface ChunkResponse {
  id: string;
  document_id: string;
  ordinal: number;
  text: string;
  dimension: number;
}

export interface ChunkListResponse {
  items: ChunkResponse[];
  count: number;
}

export interface ContentAcceptedResponse {
  document_id: string;
  status: string;
}

export interface JobResponse {
  id: string;
  document_id: string;
  status: string;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
}

export interface JobListResponse {
  items: JobResponse[];
}

export interface SearchResultItem {
  chunk_id: string;
  document_id: string;
  text: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
}

export interface Citation {
  marker: number;
  chunk_id: string;
  document_id: string;
}

export type AnswerEvent =
  | { type: "sources"; flagged: boolean; citations: Citation[] }
  | { type: "token"; text: string }
  | { type: "done" };
