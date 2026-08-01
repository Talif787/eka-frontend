"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, ScrollText } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { issueToken } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/store";
import { toast } from "sonner";

const formSchema = z.object({
  tenant_id: z.string().uuid("Enter a valid UUID, or generate one"),
  subject: z.string().min(1, "Subject is required"),
  roles: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { tenant_id: "", subject: "dev-user", roles: "admin" },
  });

  React.useEffect(() => {
    setValue("tenant_id", crypto.randomUUID());
  }, [setValue]);

  async function onSubmit(values: FormValues) {
    try {
      const roles = values.roles.split(",").map((r) => r.trim()).filter(Boolean);
      const res = await issueToken({ tenant_id: values.tenant_id, subject: values.subject, roles });
      setToken(res.access_token);
      toast.success("Signed in", { description: `Workspace ${values.tenant_id.slice(0, 8)}` });
      router.replace("/dashboard");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not reach the API. Is it running?";
      toast.error("Sign in failed", { description: msg });
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Thesis panel: the product's reason to exist is provenance. */}
      <div className="relative hidden overflow-hidden border-r bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ScrollText className="size-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">EKA</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md"
        >
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight">
            Answers you can <span className="text-primary">trace</span> back to their source.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            EKA retrieves from your corpus and grounds every answer in cited passages, so a claim
            is never separated from where it came from.
          </p>
        </motion.div>
        <div className="font-mono text-xs text-muted-foreground">
          retrieve → ground → cite → answer
        </div>
      </div>

      {/* Sign-in panel */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <span className="font-display text-xl font-semibold tracking-tight">EKA</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Mint a workspace token to open the console. Each token is scoped to one tenant.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="tenant_id">Workspace ID</Label>
              <div className="flex gap-2">
                <Input id="tenant_id" spellCheck={false} className="font-mono text-xs" {...register("tenant_id")} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Generate a new workspace"
                  onClick={() => setValue("tenant_id", crypto.randomUUID(), { shouldValidate: true })}
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
              {errors.tenant_id ? <p className="text-xs text-destructive">{errors.tenant_id.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register("subject")} />
              {errors.subject ? <p className="text-xs text-destructive">{errors.subject.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roles">Roles</Label>
              <Input id="roles" placeholder="admin, member" {...register("roles")} />
              <p className="text-xs text-muted-foreground">Comma separated. Encoded into the token claims.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : <>Open console <ArrowRight className="size-4" /></>}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
