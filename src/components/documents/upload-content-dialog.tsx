"use client";
import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useUploadContent } from "@/lib/hooks/use-documents";

export function UploadContentDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState("");
  const upload = useUploadContent();

  async function submit() {
    if (!content.trim()) return;
    await upload.mutateAsync({ id: documentId, content });
    setContent("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Upload className="size-4" /> Upload content</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload content</DialogTitle>
          <DialogDescription>
            Queue text for this document. The worker chunks and embeds it, then it becomes
            searchable and citable.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="upload-content">Content</Label>
          <Textarea
            id="upload-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the document text..."
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={upload.isPending || !content.trim()}>
            {upload.isPending ? <><Spinner /> Queuing</> : "Queue for ingestion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
