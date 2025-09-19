"use client";

import { useFormStatus } from "react-dom";
import { executeLogout } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/Button";

function LogoutSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="sm" disabled={pending}>
      {pending ? "正在退出..." : "退出登录"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={executeLogout}>
      <LogoutSubmit />
    </form>
  );
}
