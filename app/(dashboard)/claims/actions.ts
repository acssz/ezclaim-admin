"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import type { Claim, ClaimStatus } from "@/types/api";

export interface ClaimActionState {
  error?: string;
  success?: string;
}

export async function updateClaimStatus(claimId: string, status: ClaimStatus): Promise<ClaimActionState> {
  if (!claimId) {
    return { error: "缺少报销单 ID" };
  }

  try {
    await apiFetch<Claim>(`/api/claims/${claimId}`, {
      method: "PATCH",
      body: { status },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "更新状态失败" };
  }

  revalidatePath("/claims");
  revalidatePath(`/claims/${claimId}`);
  return { success: "状态已更新" };
}
