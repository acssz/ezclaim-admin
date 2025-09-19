import { CLAIM_STATUS_LABELS } from "@/lib/utils/claims";
import type { ClaimStatus, Claim } from "@/types/api";

const STATUS_ORDER: ClaimStatus[] = [
  "SUBMITTED",
  "APPROVED",
  "PAID",
  "PAYMENT_FAILED",
  "REJECTED",
  "FINISHED",
  "WITHDRAW",
  "UNKNOWN",
];

const STATUS_COLORS: Record<string, { background: string; color: string }> = {
  SUBMITTED: { background: "rgba(59, 130, 246, 0.12)", color: "#1d4ed8" },
  APPROVED: { background: "rgba(16, 185, 129, 0.12)", color: "#047857" },
  PAID: { background: "rgba(14, 165, 233, 0.12)", color: "#0369a1" },
  REJECTED: { background: "rgba(248, 113, 113, 0.18)", color: "#b91c1c" },
  PAYMENT_FAILED: { background: "rgba(251, 191, 36, 0.18)", color: "#b45309" },
  FINISHED: { background: "rgba(168, 85, 247, 0.15)", color: "#6d28d9" },
  WITHDRAW: { background: "rgba(148, 163, 184, 0.15)", color: "#475569" },
  UNKNOWN: { background: "rgba(15, 23, 42, 0.12)", color: "#0f172a" },
};

export function ClaimsSummary({ claims }: { claims: Claim[] }) {
  const total = claims.length;
  const grouped = STATUS_ORDER.map((status) => {
    const count = claims.filter((claim) => claim.status === status).length;
    const ratio = total > 0 ? Math.round((count / total) * 100) : 0;
    return { status, count, ratio };
  }).filter(({ count }) => count > 0);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <div
      className="grid"
      style={{ gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
    >
      {grouped.map(({ status, count, ratio }) => (
        <div
          key={status}
          className="card card-compact"
          style={{
            background: STATUS_COLORS[status].background,
            color: STATUS_COLORS[status].color,
            border: "1px solid rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            className="text-muted"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em", color: STATUS_COLORS[status].color }}
          >
            {CLAIM_STATUS_LABELS[status]}
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{count}</div>
          <div style={{ fontSize: "0.85rem" }}>{ratio}% / {total} 条</div>
        </div>
      ))}
    </div>
  );
}
