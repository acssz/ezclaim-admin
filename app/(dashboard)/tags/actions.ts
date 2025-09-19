"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import type { Tag, TagRequest } from "@/types/api";

export interface TagFormState {
  error?: string;
  success?: string;
}

const CREATE_SUCCESS = "标签已创建";
const DELETE_SUCCESS = "标签已删除";

export async function createTag(_: TagFormState, formData: FormData): Promise<TagFormState> {
  const label = String(formData.get("label") || "").trim();
  const color = String(formData.get("color") || "").trim();

  if (!label) {
    return { error: "请输入标签名称" };
  }

  if (!color) {
    return { error: "请选择颜色" };
  }

  try {
    await apiFetch<Tag>("/api/tags", {
      method: "POST",
      body: { label, color } satisfies TagRequest,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "创建标签失败" };
  }

  revalidatePath("/tags");
  return { success: CREATE_SUCCESS };
}

export async function removeTag(id: string): Promise<TagFormState> {
  if (!id) {
    return { error: "未知的标签" };
  }

  try {
    await apiFetch(`/api/tags/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "删除标签失败" };
  }

  revalidatePath("/tags");
  return { success: DELETE_SUCCESS };
}
