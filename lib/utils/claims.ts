import type { ClaimStatus } from "@/types/api";

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  UNKNOWN: "未知",
  SUBMITTED: "已提交",
  APPROVED: "审批通过",
  PAID: "已支付",
  FINISHED: "已完成",
  REJECTED: "已驳回",
  PAYMENT_FAILED: "支付失败",
  WITHDRAW: "已撤回",
};

export const CLAIM_STATUS_CLASS: Record<ClaimStatus, string> = {
  UNKNOWN: "status-chip status-unknown",
  SUBMITTED: "status-chip status-submitted",
  APPROVED: "status-chip status-approved",
  PAID: "status-chip status-paid",
  FINISHED: "status-chip status-finished",
  REJECTED: "status-chip status-rejected",
  PAYMENT_FAILED: "status-chip status-payment-failed",
  WITHDRAW: "status-chip status-withdraw",
};

export function getAdminTransitions(status: ClaimStatus): ClaimStatus[] {
  switch (status) {
    case "SUBMITTED":
      return ["APPROVED", "REJECTED"];
    case "APPROVED":
      return ["PAID", "PAYMENT_FAILED"];
    default:
      return [];
  }
}
