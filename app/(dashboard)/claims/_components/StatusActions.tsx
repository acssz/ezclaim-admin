"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ClaimStatus } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { CLAIM_STATUS_LABELS, getAdminTransitions } from "@/lib/utils/claims";
import { updateClaimStatus } from "../actions";

interface StatusActionsProps {
  claimId: string;
  currentStatus: ClaimStatus;
  showPlaceholder?: boolean;
}

export function StatusActions({ claimId, currentStatus, showPlaceholder = false }: StatusActionsProps) {
  const router = useRouter();
  const transitions = getAdminTransitions(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<ClaimStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  if (transitions.length === 0) {
    return showPlaceholder ? (
      <span className="text-muted" style={{ fontSize: "0.85rem" }}>
        当前状态不可操作
      </span>
    ) : null;
  }

  const handleChange = (nextStatus: ClaimStatus) => {
    setPendingStatus(nextStatus);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateClaimStatus(claimId, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.success ?? "状态已更新");
      }
      setPendingStatus(null);
      router.refresh();
    });
  };

  const labelFor = (target: ClaimStatus) => {
    if (target === "APPROVED") return "审批通过";
    if (target === "PAID") return "支付成功";
    if (target === "PAYMENT_FAILED") return "支付失败";
    if (target === "REJECTED") return "驳回申请";
    return CLAIM_STATUS_LABELS[target];
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {transitions.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={
              status === "REJECTED" || status === "PAYMENT_FAILED" ? "danger" : "primary"
            }
            disabled={isPending && pendingStatus === status}
            onClick={() => handleChange(status)}
          >
            {isPending && pendingStatus === status ? "更新中..." : labelFor(status)}
          </Button>
        ))}
      </div>
      {message && (
        <span className="badge" style={{ background: "rgba(74, 222, 128, 0.2)", color: "#16a34a" }}>
          {message}
        </span>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
