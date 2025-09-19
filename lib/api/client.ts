import "server-only";

import { cookies } from "next/headers";
import { API_BASE_URL, SESSION_COOKIE } from "@/lib/config";
import type { ApiError } from "@/types/api";

export class ApiFetchError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiFetchError";
    this.status = status;
    this.details = details;
  }
}

export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
};

export async function apiFetch<T>(
  path: string,
  { auth = true, query, headers, body, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  const finalHeaders = new Headers(headers);
  if (body && !(body instanceof FormData)) {
    if (!finalHeaders.has("content-type")) {
      finalHeaders.set("content-type", "application/json");
    }
    body = typeof body === "string" ? body : JSON.stringify(body);
  }

  if (auth) {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) {
      throw new ApiFetchError("Not authenticated", 401);
    }
    finalHeaders.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    method: init.method || (body ? "POST" : "GET"),
    headers: finalHeaders,
    body: body as BodyInit | null | undefined,
    cache: init.cache ?? "no-store",
  });

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  }

  let errorPayload: ApiError | undefined;
  try {
    const data = await response.json();
    errorPayload = {
      status: response.status,
      message: data.message || response.statusText,
      details: data,
    };
  } catch {
    errorPayload = {
      status: response.status,
      message: response.statusText,
    };
  }

  throw new ApiFetchError(errorPayload.message, errorPayload.status, errorPayload.details);
}
