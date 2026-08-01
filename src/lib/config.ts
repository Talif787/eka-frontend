// The Next.js proxy target. All calls go same-origin to /api/backend/* and are
// rewritten to the FastAPI backend (see next.config.mjs), which sidesteps CORS
// and lets the SSE answer stream pass through cleanly.
// When NEXT_PUBLIC_API_BASE_URL is set, the browser calls the backend
// directly (cross-origin; the backend must send CORS headers). This is the
// reliable path when the frontend and backend live in different Codespaces,
// since it avoids stacking two port tunnels. Leave it unset to use the
// same-origin Next proxy (works when the backend is on loopback).
const directBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
export const API_PREFIX = directBase || "/api/backend";

export const PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Mirrors eka.modules.documents.domain.document.SourceType
export const SOURCE_TYPES = [
  "upload",
  "confluence",
  "sharepoint",
  "jira",
  "notion",
  "google_drive",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  upload: "Direct upload",
  confluence: "Confluence",
  sharepoint: "SharePoint",
  jira: "Jira",
  notion: "Notion",
  google_drive: "Google Drive",
};
