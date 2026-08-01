import { z } from "zod";
import { SOURCE_TYPES } from "@/lib/config";

// Mirrors TokenRequest (tenant_id required UUID; subject defaulted; roles list).
export const tokenRequestSchema = z.object({
  tenant_id: z.string().uuid("Tenant ID must be a valid UUID"),
  subject: z.string().min(1, "Subject is required").default("dev-user"),
  roles: z.array(z.string()).default([]),
});
export type TokenRequestInput = z.input<typeof tokenRequestSchema>;

// Mirrors RegisterDocumentRequest exactly, including the sha256 hash pattern.
export const registerDocumentSchema = z.object({
  collection_id: z.string().uuid("Collection ID must be a valid UUID"),
  title: z.string().min(1, "Title is required").max(512, "Title is too long"),
  source_type: z.enum(SOURCE_TYPES),
  source_uri: z.string().min(1, "Source URI is required").max(2048),
  content_hash: z
    .string()
    .regex(/^[0-9a-f]{64}$/, "Content hash must be a 64-character lowercase hex sha256"),
});
export type RegisterDocumentInput = z.infer<typeof registerDocumentSchema>;

export const searchSchema = z.object({
  query: z.string().min(1, "Enter a query"),
  top_k: z.number().int().min(1).max(50).default(5),
  collection_id: z.string().uuid().optional(),
});
export type SearchInput = z.infer<typeof searchSchema>;
