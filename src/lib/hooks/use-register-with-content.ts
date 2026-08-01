"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerDocument, uploadContent } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/store";
import { sha256Hex } from "@/lib/utils";
import type { SourceType } from "@/lib/config";

export interface RegisterWithContentInput {
  collection_id: string;
  title: string;
  source_type: SourceType;
  source_uri: string;
  content: string;
}

// The real ingestion path: register the document metadata (which needs a
// content hash), then upload the content so the worker chunks and embeds it.
export function useRegisterWithContent() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterWithContentInput) => {
      const content_hash = await sha256Hex(input.content);
      const doc = await registerDocument(
        {
          collection_id: input.collection_id,
          title: input.title,
          source_type: input.source_type,
          source_uri: input.source_uri,
          content_hash,
        },
        token!,
      );
      await uploadContent(doc.id, input.content, token!);
      return doc;
    },
    onSuccess: (doc) => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document registered", {
        description: `${doc.title} queued for ingestion.`,
      });
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Could not register the document";
      toast.error("Registration failed", { description: msg });
    },
  });
}
