"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { search, type SearchBody } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/store";

export function useSearch() {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: (body: SearchBody) => search(body, token!),
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Search failed";
      toast.error("Search failed", { description: msg });
    },
  });
}
