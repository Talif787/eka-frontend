# Frontend architecture

## Stack

Next.js 15 (App Router), React 19, TypeScript in strict mode. TanStack Query owns
server state, Zustand holds the small amount of client state (auth token and
claims, command-palette open state), React Hook Form with Zod handles forms, and
Tailwind with a CSS-variable token system drives theming. UI primitives are
Radix-based.

## Folder layout

- `src/app` routing. A public `login` route and an authenticated `(app)` route
  group (dashboard, documents, search, answer, ingestion) behind an auth gate.
- `src/components/ui` design-system primitives (button, dialog, table, and so on).
- `src/components/<feature>` feature components (documents, search, answer,
  dashboard, ingestion, command, layout).
- `src/lib/api` the typed client: DTO types, endpoint functions, Zod schemas,
  the fetch wrapper, and the error envelope.
- `src/lib/hooks` TanStack Query hooks, one concern per file.
- `src/lib/auth` token store and JWT decode.
- `src/lib/query` query client and keys.
- `src/lib/command` command-palette store.

## Data flow

Components call hooks, hooks call typed endpoint functions, endpoint functions
call the shared `apiFetch` wrapper. The wrapper attaches the token (as both an
Authorization bearer and an `X-EKA-Token` header), parses the backend error
envelope into a typed `ApiError`, and a global handler clears the session on 401.

## Auth

Sign-in mints a tenant-scoped JWT from the dev token endpoint. The token and its
decoded claims live in a persisted Zustand store. The auth gate renders the app
only when a non-expired token is present and re-checks on focus.

## State boundaries

Server data is never copied into local state; it stays in the query cache and is
invalidated on mutations. Local state is limited to UI concerns (form values,
hover, palette open, the streaming answer buffer).
