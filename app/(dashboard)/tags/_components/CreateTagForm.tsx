"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createTag, type TagFormState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: TagFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "创建中..." : "创建标签"}
    </Button>
  );
}

export function CreateTagForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createTag, initialState);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="content-card"
      style={{ display: "grid", gap: "1.25rem", maxWidth: "480px" }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>创建新标签</h3>
        <p className="text-muted" style={{ margin: "0.35rem 0 0", fontSize: "0.9rem" }}>
          设置一个名称和颜色，便于在报销单中进行分类。
        </p>
      </div>
      <Input name="label" label="标签名称" placeholder="如：出差" required />
      <div>
        <label className="label" htmlFor="tag-color">
          标签颜色
        </label>
        <input id="tag-color" name="color" type="color" defaultValue="#2563eb" style={{ width: "100%", height: "44px", borderRadius: "0.6rem", border: "1px solid var(--border)", background: "#ffffff", padding: "0.2rem" }} required />
      </div>
      {state?.error && <div className="form-error">{state.error}</div>}
      {state?.success && <div className="badge" style={{ background: "rgba(74, 222, 128, 0.2)", color: "#15803d" }}>{state.success}</div>}
      <SubmitButton />
    </form>
  );
}
