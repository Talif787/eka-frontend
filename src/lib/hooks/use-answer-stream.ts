"use client";
import * as React from "react";
import { streamAnswer, type AnswerBody } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/auth/store";
import type { Citation } from "@/lib/api/types";

export type AnswerStatus = "idle" | "streaming" | "done" | "error";

export interface AnswerState {
  status: AnswerStatus;
  answer: string;
  citations: Citation[];
  flagged: boolean;
  error: string | null;
  query: string | null;
}

const INITIAL: AnswerState = {
  status: "idle",
  answer: "",
  citations: [],
  flagged: false,
  error: null,
  query: null,
};

// Drives the /v1/answer SSE stream: a sources event seeds the citations, token
// events accumulate the answer text, and done closes it out. A new question
// aborts the previous stream.
export function useAnswerStream() {
  const token = useAuthStore((s) => s.token);
  const [state, setState] = React.useState<AnswerState>(INITIAL);
  const abortRef = React.useRef<AbortController | null>(null);

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL);
  }, []);

  const ask = React.useCallback(
    async (body: AnswerBody) => {
      if (!token) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setState({ ...INITIAL, status: "streaming", query: body.query });
      try {
        for await (const event of streamAnswer(body, token, controller.signal)) {
          if (controller.signal.aborted) return;
          if (event.type === "sources") {
            setState((s) => ({ ...s, citations: event.citations, flagged: event.flagged }));
          } else if (event.type === "token") {
            setState((s) => ({ ...s, answer: s.answer + event.text }));
          } else if (event.type === "done") {
            setState((s) => ({ ...s, status: "done" }));
          }
        }
        setState((s) => (s.status === "streaming" ? { ...s, status: "done" } : s));
      } catch (e) {
        if (controller.signal.aborted) return;
        const msg = e instanceof Error ? e.message : "The answer stream failed";
        setState((s) => ({ ...s, status: "error", error: msg }));
      }
    },
    [token],
  );

  React.useEffect(() => () => abortRef.current?.abort(), []);

  return { ...state, ask, reset };
}
