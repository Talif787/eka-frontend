# Frontend F1 notes

## What F1 delivers

- Runnable Next.js 15 App Router project: config, strict TypeScript, Tailwind
  token system (light/dark/system), Radix-based UI primitives.
- Auth: dev-token sign-in that mints a tenant-scoped JWT, decodes its claims, and
  persists it (Zustand + localStorage). An auth gate guards the app route group.
- App shell: sidebar, topbar with tenant badge, theme toggle, user menu.
- Complete typed API layer for every real endpoint (documents, ingestion,
  chunks, jobs, search, and the SSE answer stream), with a uniform error envelope
  parser and TanStack Query hooks.
- Documents feature end to end: paginated list, register-and-ingest dialog (with
  client-side SHA-256 hashing), detail view with metadata and chunks, content
  upload, and delete with confirmation.

## Key decisions

- Same-origin proxy via `next.config` rewrites instead of backend CORS changes.
  Keeps the backend untouched and lets SSE pass through.
- SSE answer stream (wired in the client now, UI in F2) uses fetch plus a stream
  reader, not EventSource, because the request is an authenticated POST.
- Register plus ingest is one action: the dialog hashes the pasted content,
  registers the document, then uploads the content so the worker can chunk and
  embed it. That mirrors the real backend flow.
- Zod schemas mirror the Pydantic constraints (sha256 hash pattern, title length,
  source-type enum) so bad input fails in the browser.

## Design direction

Thesis is provenance: answers you can trace to their source. The boldness is
saved for the grounding rail in the Answer view (F2), where citation markers link
to source cards that illuminate as sources and tokens stream in. Everything else
stays quiet: an editorial neutral canvas, one iris accent, a reserved amber
scoped only to citations, and monospace for data (scores, IDs, chunk ordinals).
Type is Bricolage Grotesque (display), Inter (body), JetBrains Mono (data).

## Coming next

- F2: Search results view, and the streaming Answer view with the grounding rail.
- F3: Ingestion jobs monitor (polling, dead-letter surfacing), dashboard KPIs,
  command palette, and mobile navigation drawer.

## Follow-ups noted, not blocking

- Mobile sidebar is hidden below `lg`; a slide-in drawer lands in F3.
- Token lives in localStorage for this dev tool; an httpOnly cookie exchange
  would be the production hardening.
