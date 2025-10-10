import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/config";
import type { ClientSession } from "@/types/auth";

interface JwtPayload {
  sub?: string;
  exp?: number;
  scope?: string;
  [key: string]: unknown;
}

export interface Session {
  token: string;
  subject: string | null;
  scopes: string[];
  expiresAt: Date | null;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = decodeJwt(token);
  const scopes = payload?.scope ? String(payload.scope).split(" ") : [];
  const expSeconds = payload?.exp;
  const expiresAt = expSeconds ? new Date(expSeconds * 1000) : null;
  return {
    token,
    subject: (payload?.sub as string | undefined) ?? null,
    scopes,
    expiresAt,
  };
}

export function toClientSession(session: Session | null): ClientSession | null {
  if (!session) return null;
  return {
    subject: session.subject,
    scopes: session.scopes,
    expiresAt: session.expiresAt ? session.expiresAt.toISOString() : null,
  };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function setSession(token: string, maxAgeSeconds?: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: maxAgeSeconds ?? SESSION_COOKIE_OPTIONS.maxAge,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function hasScope(session: Session | null, scope: string): boolean {
  if (!session) return false;
  return session.scopes.includes(scope);
}
