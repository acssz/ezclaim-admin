"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

function toLocalInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

export interface AuditFiltersProps {
  initial: {
    entityType?: string;
    entityId?: string;
    action?: string;
    from?: string;
    to?: string;
    size?: number;
  };
}

export function AuditFilters({ initial }: AuditFiltersProps) {
  const router = useRouter();
  const handleReset = useCallback(
    (event: React.FormEvent<HTMLButtonElement>) => {
      event.preventDefault();
      router.push("/audit-events");
    },
    [router],
  );

  return (
    <form method="get" className="content-card" style={{ display: "grid", gap: "1.25rem" }}>
      <div>
        <h3 style={{ margin: 0 }}>筛选条件</h3>
        <p className="text-muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
          根据实体、动作或时间范围查询审计事件，支持分页查看。
        </p>
      </div>

      <div className="grid" style={{ gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div>
          <label className="label" htmlFor="entityType">
            实体类型
          </label>
          <input
            className="input"
            id="entityType"
            name="entityType"
            placeholder="如：CLAIM"
            defaultValue={initial.entityType ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="entityId">
            实体 ID
          </label>
          <input
            className="input"
            id="entityId"
            name="entityId"
            placeholder="目标对象 ID"
            defaultValue={initial.entityId ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="action">
            动作
          </label>
          <input
            className="input"
            id="action"
            name="action"
            placeholder="如：UPDATED"
            defaultValue={initial.action ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="size">
            每页数量
          </label>
          <select className="input" id="size" name="size" defaultValue={String(initial.size ?? 20)}>
            {[10, 20, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid" style={{ gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label className="label" htmlFor="from">
            起始时间
          </label>
          <input
            className="input"
            id="from"
            name="from"
            type="datetime-local"
            defaultValue={toLocalInputValue(initial.from)}
          />
        </div>
        <div>
          <label className="label" htmlFor="to">
            结束时间
          </label>
          <input
            className="input"
            id="to"
            name="to"
            type="datetime-local"
            defaultValue={toLocalInputValue(initial.to)}
          />
        </div>
      </div>

      <input type="hidden" name="page" value="0" />

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="submit" className="btn btn-primary btn-sm">
          查询
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          重置
        </button>
      </div>
    </form>
  );
}
