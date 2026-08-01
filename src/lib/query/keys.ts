export const queryKeys = {
  documents: (params: Record<string, unknown>) => ["documents", params] as const,
  document: (id: string) => ["document", id] as const,
  chunks: (id: string) => ["chunks", id] as const,
  jobs: (params: Record<string, unknown>) => ["jobs", params] as const,
} as const;
