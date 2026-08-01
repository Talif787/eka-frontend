/** @type {import('next').NextConfig} */
const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,
  // Same-origin proxy to the FastAPI backend. The browser calls /api/backend/*,
  // Next forwards to the API, so there is no CORS to configure and the SSE
  // answer stream passes straight through.
  async rewrites() {
    return [{ source: "/api/backend/:path*", destination: `${API_BASE_URL}/:path*` }];
  },
};

export default nextConfig;
