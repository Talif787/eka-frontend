# API integration

## Reaching the backend

Two topologies are supported, selected by environment variables read at startup.

Same host: leave `NEXT_PUBLIC_API_BASE_URL` unset. The app calls same-origin
`/api/backend/*`, and `next.config.mjs` rewrites those to `API_BASE_URL` over
loopback. No CORS needed.

Separate hosts (for example two Codespaces): set `NEXT_PUBLIC_API_BASE_URL` to the
backend's URL. The browser then calls the backend directly, cross-origin, which
requires CORS enabled on the backend.

## Auth header

Every authenticated request carries the token twice: the standard
`Authorization: Bearer <jwt>` and a custom `X-EKA-Token`. The duplicate exists
because some proxy tunnels consume the Authorization header for their own auth;
the custom header passes through, and the backend accepts either.

## Endpoints covered

Auth (`POST /v1/auth/token`), documents (list, get, register, delete), content
upload, chunks, ingestion jobs, search, and the streaming answer. Each has a
typed function in `src/lib/api/endpoints.ts` and a hook in `src/lib/hooks`.

## Streaming

The answer endpoint is Server-Sent Events over a POST, so it uses fetch plus a
stream reader (not EventSource). `streamAnswer` is an async generator yielding
typed `sources`, `token`, and `done` events; the `useAnswerStream` hook turns
them into UI state and supports aborting an in-flight stream.

## Errors and caching

Non-2xx responses become a typed `ApiError` carrying code, message, and request
id. Queries retry only transient (5xx) failures, never auth or client errors. A
401 anywhere clears the session and returns the user to login.
