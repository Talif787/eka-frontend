"use client";
import { useQuery } from "@tanstack/react-query";
import { getDocument } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import { queryKeys } from "@/lib/query/keys";

export function useDocument(id: string) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => getDocument(id, token!),
    enabled: Boolean(token && id),
  });
}
