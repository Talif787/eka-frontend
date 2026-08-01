"use client";
import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "./status-badge";
import { SOURCE_TYPE_LABELS, type SourceType } from "@/lib/config";
import { formatRelativeTime } from "@/lib/utils";
import { useDeleteDocument } from "@/lib/hooks/use-documents";
import type { DocumentResponse } from "@/lib/api/types";

export function DocumentsTable({ documents }: { documents: DocumentResponse[] }) {
  const [toDelete, setToDelete] = React.useState<DocumentResponse | null>(null);
  const del = useDeleteDocument();

  async function confirmDelete() {
    if (!toDelete) return;
    await del.mutateAsync(toDelete.id);
    setToDelete(null);
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Version</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Link href={`/documents/${doc.id}`} className="flex items-center gap-2 font-medium hover:text-primary">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{doc.title}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{SOURCE_TYPE_LABELS[doc.source_type as SourceType] ?? doc.source_type}</Badge>
                </TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell className="text-right font-mono text-xs tabular">v{doc.version}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatRelativeTime(doc.created_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Row actions"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/documents/${doc.id}`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10"
                        onClick={() => setToDelete(doc)}
                      >
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(toDelete)} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete document</DialogTitle>
            <DialogDescription>
              This removes {toDelete?.title ? <span className="font-medium text-foreground">{toDelete.title}</span> : "the document"} and its chunks. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={del.isPending}>
              {del.isPending ? <><Spinner /> Deleting</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
