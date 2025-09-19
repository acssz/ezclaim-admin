"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate, type AuthState } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} style={{ width: "100%" }}>
      {pending ? "登录中..." : "登录"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(authenticate, initialState);

  return (
    <form action={formAction} className="grid" style={{ gap: "1.5rem" }}>
      <div className="grid" style={{ gap: "1.2rem" }}>
        <Input
          name="username"
          label="用户名"
          placeholder="admin"
          autoComplete="username"
          required
        />
        <Input
          name="password"
          label="密码"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && <div className="form-error">{state.error}</div>}

      <SubmitButton />
    </form>
  );
}
