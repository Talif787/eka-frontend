// Minimal JWT payload decode (no verification; the backend verifies). Used only
// to surface tenant, subject, roles, and expiry in the UI.
export interface JwtClaims {
  iss?: string;
  sub?: string;
  tid?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export function decodeJwt(token: string): JwtClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "="));
    return JSON.parse(decodeURIComponent(escape(json))) as JwtClaims;
  } catch {
    return null;
  }
}

export function isExpired(claims: JwtClaims | null): boolean {
  if (!claims?.exp) return false;
  return claims.exp * 1000 <= Date.now();
}
