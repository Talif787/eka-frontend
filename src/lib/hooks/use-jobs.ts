"use client";
import { useQuery } from "@tanstack/react-query";
import { listJobs } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import { queryKeys } from "@/lib/query/keys";

export function useJobs(
  params: { status?: string; limit?: number; offset?: number },
  opts?: { refetchInterval?: number },
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.jobs(params),
    queryFn: () => listJobs(params, token!),
    enabled: Boolean(token),
    refetchInterval: opts?.refetchInterval,
    placeholderData: (prev) => prev,
  });
}
