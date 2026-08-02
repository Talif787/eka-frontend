# EKA Frontend

A Next.js console for EKA, a retrieval-augmented knowledge assistant. Ask a
question and the answer streams in with inline citation markers that trace to the
exact source passages, backed by a workspace to register documents, watch them
ingest, and search the corpus.

**Live demo: [<LIVE_URL>](https://eka-frontend-five.vercel.app/)** (open, no signup; each visitor gets an isolated tenant
sandbox). Backend repo:
[eka-knowledge-assistant](https://github.com/Talif787/eka-knowledge-assistant).

A short demo clip is coming soon. In the meantime, try it live at the link above: sign in (a workspace is created for you), register a document, then ask a question in the Answer view and watch the response stream in with citations.

Every backend endpoint has a screen: a KPI dashboard, documents (register,
ingest, drill into chunks), search, the streaming answer view with a grounding
rail (citation markers linked to the source passages that back each claim), a
live ingestion jobs monitor, and a command palette.

## Stack

Next.js 15 (App Router), React 19, TypeScript (strict). TanStack Query for server
state, Zustand for the auth token and claims, React Hook Form with Zod for forms,
Tailwind with a CSS-variable token system for theming, and Radix-based
primitives. Developer guides live in `docs/`.

## Prerequisites

- Node.js 20 or newer (Next 15 needs at least 18.18).
- The EKA backend running and reachable, with the dev token endpoint enabled
  (`EKA_AUTH_DEV_TOKEN_ENABLED=true`, the default in development) so
  `POST /v1/auth/token` responds.

## Connecting to the backend

The app reaches the API in one of two ways, chosen by an environment variable
read at build time:

- **Direct (used in production).** Set `NEXT_PUBLIC_API_BASE_URL` to the backend
  URL. The browser calls the API directly, cross-origin, so the backend must
  allow this app's origin through CORS (`EKA_CORS_ALLOW_ORIGINS`). This is how the
  live deploy works: the Vercel frontend calls the Fly.io API.
- **Same-origin proxy (simplest for local dev on one machine).** Leave
  `NEXT_PUBLIC_API_BASE_URL` unset and set `API_BASE_URL`. `next.config.mjs`
  rewrites `/api/backend/*` to `API_BASE_URL` over loopback, so there is no CORS
  to configure. Use `127.0.0.1` rather than `localhost` so Node resolves IPv4 and
  reaches an IPv4-only port.

The auth token is sent as both an `Authorization` bearer and an `X-EKA-Token`
header; the second survives proxies and port tunnels that consume `Authorization`
for their own auth, and the backend accepts either.

## Local development

```bash
npm install
cp .env.example .env.local
# same-host dev: set API_BASE_URL=http://127.0.0.1:8000 in .env.local
npm run dev
```

Open http://localhost:3000. On the sign-in screen, click the refresh icon to mint
a fresh workspace ID (a UUID), keep the default subject and roles, and open the
console. The token is stored in the browser and scoped to that one tenant.

## Scripts

- `npm run dev` runs the dev server.
- `npm run build` / `npm run start` build and serve production.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm run lint` runs Next's ESLint.

Run `npm run build` before pushing; it is the same production compile Vercel runs
and catches type errors that `npm run dev` does not.

## Deployment

Deployed on Vercel, auto-deploying on push to `main`. Set
`NEXT_PUBLIC_API_BASE_URL` to the backend URL in the Vercel project's environment
variables (Production), and add the Vercel origin to the backend's
`EKA_CORS_ALLOW_ORIGINS`. Because `NEXT_PUBLIC_` values are inlined at build time,
changing the URL requires a redeploy.

## Note on authentication

The public demo runs an open token endpoint so anyone can try it in an isolated
tenant sandbox. It is demo-mode auth, not a real identity system; production would
add proper user authentication.
