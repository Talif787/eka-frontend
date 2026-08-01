"use client";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw } from "lucide-react";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { SOURCE_TYPES, SOURCE_TYPE_LABELS, type SourceType } from "@/lib/config";
import { useRegisterWithContent } from "@/lib/hooks/use-register-with-content";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(512, "Title is too long"),
  source_type: z.enum(SOURCE_TYPES),
  source_uri: z.string().min(1, "Source URI is required").max(2048),
  collection_id: z.string().uuid("Collection ID must be a valid UUID"),
  content: z.string().min(1, "Paste the content you want ingested"),
});
type FormValues = z.infer<typeof schema>;

export function RegisterDocumentDialog() {
  const [open, setOpen] = React.useState(false);
  const mutation = useRegisterWithContent();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", source_type: "upload", source_uri: "", collection_id: "", content: "" },
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) reset({ title: "", source_type: "upload", source_uri: "", collection_id: crypto.randomUUID(), content: "" });
  }

  async function onSubmit(values: FormValues) {
    await mutation.mutateAsync({
      collection_id: values.collection_id,
      title: values.title,
      source_type: values.source_type as SourceType,
      source_uri: values.source_uri,
      content: values.content,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><Plus className="size-4" /> Register document</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Register a document</DialogTitle>
          <DialogDescription>
            Metadata plus the text to ingest. The content is hashed and queued so the worker can
            chunk and embed it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Q3 onboarding runbook" {...register("title")} />
            {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Controller
                control={control}
                name="source_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>{SOURCE_TYPE_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_uri">Source URI</Label>
              <Input id="source_uri" placeholder="local://runbook.md" {...register("source_uri")} />
              {errors.source_uri ? <p className="text-xs text-destructive">{errors.source_uri.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection_id">Collection</Label>
            <div className="flex gap-2">
              <Input id="collection_id" spellCheck={false} className="font-mono text-xs" {...register("collection_id")} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Generate collection ID"
                onClick={() => setValue("collection_id", crypto.randomUUID(), { shouldValidate: true })}
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
            {errors.collection_id ? <p className="text-xs text-destructive">{errors.collection_id.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" rows={6} placeholder="Paste the document text..." {...register("content")} />
            {errors.content ? <p className="text-xs text-destructive">{errors.content.message}</p> : null}
            <p className="text-xs text-muted-foreground">Hashed with SHA-256 to deduplicate on (tenant, content).</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <><Spinner /> Registering</> : "Register and ingest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
