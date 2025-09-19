import { PageHeader } from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/client";
import type { Claim } from "@/types/api";
import { ClaimsTable } from "./_components/ClaimsTable";
import { ClaimsSummary } from "./_components/ClaimsSummary";

export default async function ClaimsPage() {
  const claims = await apiFetch<Claim[]>("/api/claims", { auth: true });

  return (
    <div className="grid" style={{ gap: "2rem" }}>
      <PageHeader
        title="报销单管理"
        description="查看所有报销申请，支持搜索、筛选以及状态变更。"
      />
      <ClaimsSummary claims={claims} />
      <ClaimsTable claims={claims} />
    </div>
  );
}
