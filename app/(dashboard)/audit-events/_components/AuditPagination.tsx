import Link from "next/link";

interface AuditPaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildQuery(
  searchParams: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) return;
    const selected = Array.isArray(value) ? value[value.length - 1] : value;
    if (selected !== undefined && selected !== null && selected !== "") {
      params.set(key, selected);
    }
  });
  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  return `?${params.toString()}`;
}

export function AuditPagination({ page, totalPages, searchParams }: AuditPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const prevDisabled = page <= 0;
  const nextDisabled = page >= totalPages - 1;

  const prevLink = prevDisabled ? (
    <span className="btn btn-secondary btn-sm" style={{ pointerEvents: "none", opacity: 0.5 }}>
      上一页
    </span>
  ) : (
    <Link
      href={`/audit-events${buildQuery(searchParams, { page: Math.max(page - 1, 0) })}`}
      className="btn btn-secondary btn-sm"
    >
      上一页
    </Link>
  );

  const nextLink = nextDisabled ? (
    <span className="btn btn-secondary btn-sm" style={{ pointerEvents: "none", opacity: 0.5 }}>
      下一页
    </span>
  ) : (
    <Link
      href={`/audit-events${buildQuery(searchParams, { page: Math.min(page + 1, totalPages - 1) })}`}
      className="btn btn-secondary btn-sm"
    >
      下一页
    </Link>
  );

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {prevLink}
      <span className="text-muted" style={{ fontSize: "0.85rem" }}>
        第 {page + 1} / {totalPages} 页
      </span>
      {nextLink}
    </nav>
  );
}
