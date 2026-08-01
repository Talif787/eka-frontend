# EKA Frontend

A Next.js console for the EKA retrieval-augmented knowledge assistant. It talks
to the EKA FastAPI backend and gives you a workspace to register documents, feed
them for ingestion, and (in later phases) search and ask grounded, cited
questions.

All three phases have shipped, and every backend endpoint now has a screen. F1:
foundation, design system, auth, app shell, the full typed API client, and the
Documents feature. F2: Search and the streaming Answer view with a grounding rail
(citation markers linked to the source passages that back each claim). F3: a live
ingestion jobs monitor, a dashboard of KPIs, and a command palette. Developer
docs live in `docs/`.

## Stack

Next.js 15 (App Router), React 19, TypeScript (strict). TanStack Query for server
state, Zustand for the auth token and claims, React Hook Form with Zod for forms,
Tailwind with a CSS-variable token system for theming, and Radix-based primitives.

## Prerequisites

1. Node.js 20 or newer (Next 15 needs at least 18.18).
2. The EKA backend running and reachable, with the dev token endpoint enabled:
   set `EKA_AUTH_DEV_TOKEN_ENABLED=true` so `POST /v1/auth/token` responds.
   With the Helm or docker-compose stack, a port-forward to `localhost:8080`
   is typical; a bare `uvicorn` run listens on `localhost:8000`.

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local so API_BASE_URL points at your running backend
npm run dev
```

Open http://localhost:3000. On the sign-in screen, click the refresh icon to mint
a fresh workspace ID (a UUID), keep the default subject and roles, and open the
console. The token is stored in the browser and scoped to that one tenant.

## How it reaches the backend

The backend has no CORS middleware, so the browser never calls it directly.
`next.config.mjs` rewrites `/api/backend/*` to `API_BASE_URL`, so every request is
same-origin to the Next server, which proxies to FastAPI. The SSE answer stream
(F2) passes straight through this proxy. To repoint the app at a different
backend, change `API_BASE_URL` in `.env.local`; nothing in the app code hardcodes
a host.

## Scripts

- `npm run dev` runs the dev server.
- `npm run build` / `npm run start` build and serve production.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm run lint` runs Next's ESLint.

## A note on verification

This repo was authored against the backend's real route and schema definitions,
but it was not installed or compiled in the environment that produced it (no
network for `npm install`, no `tsc` or `next` run). It is correct by convention.
The first `npm install && npm run dev` on your machine is the real check. If a
dependency version or a type surfaces something, report the exact message and it
gets fixed, the same loop we used for the backend deploy.
