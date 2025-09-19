import { PageHeader } from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/client";
import { AuditFilters } from "./_components/AuditFilters";
import { AuditTable } from "./_components/AuditTable";
import { AuditPagination } from "./_components/AuditPagination";
import type { AuditEvent, Page } from "@/types/api";

function pickParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }
  return value;
}

function normalizeDateParam(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toISOString();
}

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AuditEventsPage({ searchParams }: PageProps) {
  const pageParam = parseInt(pickParam(searchParams, "page") ?? "0", 10);
  const sizeParam = parseInt(pickParam(searchParams, "size") ?? "20", 10);
  const page = Number.isNaN(pageParam) ? 0 : Math.max(pageParam, 0);
  const size = Number.isNaN(sizeParam) ? 20 : Math.min(Math.max(sizeParam, 10), 200);
  const entityType = pickParam(searchParams, "entityType") ?? undefined;
  const entityId = pickParam(searchParams, "entityId") ?? undefined;
  const action = pickParam(searchParams, "action") ?? undefined;
  const from = pickParam(searchParams, "from") ?? undefined;
  const to = pickParam(searchParams, "to") ?? undefined;

  const query: Record<string, string | number | undefined> = {
    page,
    size,
    entityType: entityType || undefined,
    entityId: entityId || undefined,
    action: action || undefined,
    from: normalizeDateParam(from),
    to: normalizeDateParam(to),
    sort: "occurredAt,desc",
  };

  const response = await apiFetch<Page<AuditEvent>>("/api/audit-events", {
    query,
    auth: true,
  });

  const initialFilters = {
    entityType: entityType || undefined,
    entityId: entityId || undefined,
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
    size,
  };

  return (
    <div className="grid" style={{ gap: "2rem" }}>
      <PageHeader
        title="审计事件"
        description="查看系统产生的所有审计事件，支持过滤与分页。"
      />
      <AuditFilters initial={initialFilters} />
      <div className="content-card" style={{ display: "grid", gap: "1.5rem" }}>
        <AuditTable events={response.content} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            共 {response.totalElements} 条记录 · 每页 {response.size} 条
          </span>
          <AuditPagination
            page={response.number}
            totalPages={response.totalPages || 1}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}
