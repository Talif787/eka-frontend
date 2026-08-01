"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteDocument,
  listChunks,
  listDocuments,
  registerDocument,
  uploadContent,
  type ListDocumentsParams,
  type RegisterDocumentBody,
} from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/store";
import { queryKeys } from "@/lib/query/keys";

export function useDocuments(params: ListDocumentsParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.documents(params),
    queryFn: () => listDocuments(params, token!),
    enabled: Boolean(token),
    placeholderData: (prev) => prev,
  });
}

export function useChunks(documentId: string) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.chunks(documentId),
    queryFn: () => listChunks(documentId, token!),
    enabled: Boolean(token && documentId),
  });
}

export function useRegisterDocument() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterDocumentBody) => registerDocument(body, token!),
    onSuccess: (doc) => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document registered", { description: doc.title });
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Could not register the document";
      toast.error("Registration failed", { description: msg });
    },
  });
}

export function useUploadContent() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      uploadContent(id, content, token!),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.chunks(vars.id) });
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Content queued", { description: "Ingestion has started." });
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Could not queue content";
      toast.error("Upload failed", { description: msg });
    },
  });
}

export function useDeleteDocument() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted");
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Could not delete the document";
      toast.error("Delete failed", { description: msg });
    },
  });
}
