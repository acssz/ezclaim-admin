"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiFetchError } from "@/lib/api/client";
import { clearSession, setSession } from "@/lib/auth/session";
import type { LoginRequest, LoginResponse } from "@/types/api";

export interface AuthState {
  error?: string;
}

export async function authenticate(_: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!username || !password) {
    return { error: "请输入用户名和密码" };
  }

  try {
    const payload: LoginResponse = await apiFetch("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { username, password } satisfies LoginRequest,
    });
    const expires = new Date(payload.expiresAt);
    const ttlSeconds = Math.max(60, Math.floor((expires.getTime() - Date.now()) / 1000));
    setSession(payload.token, ttlSeconds);
  } catch (error) {
    if (error instanceof ApiFetchError) {
      if (
        error.details &&
        typeof error.details === "object" &&
        "error" in error.details &&
        error.details.error === "invalid_credentials"
      ) {
        return { error: "用户名或密码错误" };
      }
      return { error: error.message };
    }
    return { error: "登录失败，请稍后重试" };
  }

  revalidatePath("/claims");
  redirect("/claims");
}

export async function executeLogout() {
  clearSession();
  revalidatePath("/");
  redirect("/login");
}
