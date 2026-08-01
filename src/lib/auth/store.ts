import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeJwt, isExpired, type JwtClaims } from "./jwt";

interface AuthState {
  token: string | null;
  claims: JwtClaims | null;
  setToken: (token: string) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      claims: null,
      setToken: (token) => set({ token, claims: decodeJwt(token) }),
      clear: () => set({ token: null, claims: null }),
      isAuthenticated: () => {
        const { token, claims } = get();
        return Boolean(token) && !isExpired(claims);
      },
    }),
    { name: "eka-auth", partialize: (s) => ({ token: s.token, claims: s.claims }) },
  ),
);
