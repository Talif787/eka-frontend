// Uniform error surface mirroring the backend envelope:
// { error: { code, message, requestId, details } }
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isAuth(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

interface ErrorEnvelope {
  error?: { code?: string; message?: string; requestId?: string; details?: Record<string, unknown> };
}

export async function toApiError(res: Response): Promise<ApiError> {
  let body: ErrorEnvelope = {};
  try {
    body = (await res.json()) as ErrorEnvelope;
  } catch {
    // non-JSON error body; fall through to status text
  }
  const err = body.error;
  return new ApiError(
    res.status,
    err?.code ?? "http_error",
    err?.message ?? res.statusText ?? "Request failed",
    err?.requestId,
    err?.details,
  );
}
