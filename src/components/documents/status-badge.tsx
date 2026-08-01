import { Badge } from "@/components/ui/badge";

// Maps backend document/job status strings to badge tones. Unknown statuses
// fall back to neutral so new backend states never break the UI.
const TONE: Record<string, "default" | "primary" | "success" | "warning" | "destructive"> = {
  registered: "primary",
  pending: "warning",
  queued: "warning",
  processing: "primary",
  in_progress: "primary",
  completed: "success",
  ready: "success",
  succeeded: "success",
  indexed: "success",
  failed: "destructive",
  dead_letter: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONE[status.toLowerCase()] ?? "default";
  return <Badge variant={tone}>{status.replace(/_/g, " ")}</Badge>;
}
