# Developer guide

## Prerequisites

Node 20 or newer, and the EKA backend running with the dev token endpoint enabled
(`EKA_AUTH_DEV_TOKEN_ENABLED=true`, which is the default in development).

## Setup and run

```bash
npm install
cp .env.example .env.local   # then set the backend URL, see below
npm run dev
```

Open http://localhost:3000, mint a workspace on the sign-in screen, and open the
console.

## Pointing at the backend

Same machine as the backend: set `API_BASE_URL=http://127.0.0.1:8000` and leave
`NEXT_PUBLIC_API_BASE_URL` unset. Use `127.0.0.1`, not `localhost`, so Node does
not resolve to IPv6 and miss an IPv4-only port.

Different machine or Codespace: set
`NEXT_PUBLIC_API_BASE_URL=https://<backend-host>` and enable CORS on the backend.
The backend's forwarded port must be publicly reachable.

Changes to `.env.local` or `next.config.mjs` only take effect on a dev-server
restart.

## Scripts

- `npm run dev` development server
- `npm run build` / `npm run start` production build and serve
- `npm run typecheck` `tsc --noEmit`
- `npm run lint` ESLint

## Common issues

- 401 after sitting idle: the token expired (one-hour lifetime). Sign in again.
- `ECONNREFUSED` on the proxy: the backend is not reachable at the configured
  host and port, or you used `localhost` where the port is IPv4-only.
- Empty search or answer: no documents are indexed yet, register one and wait for
  it to reach `indexed`.
- Sidebar shows a page but it 404s: you are on an older build, restart the dev
  server.
