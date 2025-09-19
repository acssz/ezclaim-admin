"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Claim } from "@/types/api";
import { CLAIM_STATUS_CLASS, CLAIM_STATUS_LABELS } from "@/lib/utils/claims";
import { formatCurrency, formatDateTime, formatRelative } from "@/lib/utils/format";
import { StatusActions } from "./StatusActions";

type SortKey = "createdAt" | "updatedAt" | "amount" | "title" | "status";
type SortDirection = "asc" | "desc";

interface ClaimsTableProps {
  claims: Claim[];
}

function compare(a: Claim, b: Claim, key: SortKey, dir: SortDirection) {
  const modifier = dir === "asc" ? 1 : -1;
  switch (key) {
    case "amount": {
      const av = a.amount ?? 0;
      const bv = b.amount ?? 0;
      return (av - bv) * modifier;
    }
    case "createdAt":
    case "updatedAt": {
      const at = new Date(a[key] ?? 0).getTime();
      const bt = new Date(b[key] ?? 0).getTime();
      return (at - bt) * modifier;
    }
    case "title": {
      return a.title.localeCompare(b.title) * modifier;
    }
    case "status": {
      return a.status.localeCompare(b.status) * modifier;
    }
    default:
      return 0;
  }
}

function getSortLabel(key: SortKey) {
  switch (key) {
    case "createdAt":
      return "创建时间";
    case "updatedAt":
      return "更新时间";
    case "amount":
      return "金额";
    case "title":
      return "标题";
    case "status":
      return "状态";
    default:
      return key;
  }
}

export function ClaimsTable({ claims }: ClaimsTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const filtered = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus = statusFilter === "全部" ? true : claim.status === statusFilter;
      const lowercaseQuery = query.toLowerCase();
      const matchesQuery = query
        ? [claim.title, claim.description, claim.recipient, claim.id]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(lowercaseQuery)) ||
          claim.tags?.some((tag) => tag.label.toLowerCase().includes(lowercaseQuery))
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [claims, query, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" ? "asc" : "desc");
    }
  };

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <div className="content-card" style={{ display: "grid", gap: "1.5rem" }}>
      <div className="table-toolbar">
        <div>
          <h3 style={{ margin: 0 }}>报销单列表</h3>
          <p className="text-muted" style={{ margin: "0.35rem 0 0" }}>
            共 {sorted.length} / {claims.length} 条记录。
          </p>
        </div>
        <div className="toolbar-group">
          <input
            className="input search-input"
            placeholder="搜索标题 / 描述 / 收款人 / 标签"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="input"
            style={{ maxWidth: "180px" }}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="全部">全部状态</option>
            <option value="SUBMITTED">已提交</option>
            <option value="APPROVED">审批通过</option>
            <option value="PAID">已支付</option>
            <option value="PAYMENT_FAILED">支付失败</option>
            <option value="REJECTED">已驳回</option>
            <option value="FINISHED">已完成</option>
            <option value="WITHDRAW">已撤回</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("title")}>
                {getSortLabel("title")} {renderSortIndicator("title")}
              </th>
              <th>报销说明</th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                状态 {renderSortIndicator("status")}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("amount")}>
                金额 {renderSortIndicator("amount")}
              </th>
              <th>收款人</th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                创建时间 {renderSortIndicator("createdAt")}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("updatedAt")}>
                更新时间 {renderSortIndicator("updatedAt")}
              </th>
              <th>标签</th>
              <th style={{ width: "240px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((claim) => (
              <tr key={claim.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{claim.title}</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                    ID: {claim.id}
                  </div>
                </td>
                <td style={{ maxWidth: "260px" }}>
                  <div style={{ fontSize: "0.85rem", whiteSpace: "pre-line" }}>
                    {claim.description ?? "-"}
                  </div>
                </td>
                <td>
                  <span className={CLAIM_STATUS_CLASS[claim.status]}>
                    {CLAIM_STATUS_LABELS[claim.status]}
                  </span>
                </td>
                <td>{formatCurrency(claim.amount, claim.currency)}</td>
                <td>{claim.recipient ?? "-"}</td>
                <td>
                  <div>{formatDateTime(claim.createdAt)}</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {formatRelative(claim.createdAt)}
                  </div>
                </td>
                <td>
                  <div>{formatDateTime(claim.updatedAt)}</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {formatRelative(claim.updatedAt)}
                  </div>
                </td>
                <td style={{ minWidth: "140px" }}>
                  {claim.tags && claim.tags.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {claim.tags.map((tag) => (
                        <span key={tag.id} className="tag-pill" style={{ background: `${tag.color}22` }}>
                          <span className="tag-dot" style={{ background: tag.color }} />
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">无标签</span>
                  )}
                </td>
                <td>
                  <div className="table-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <Link href={`/claims/${claim.id}`} className="btn btn-secondary btn-sm" style={{ textAlign: "center" }}>
                      查看详情
                    </Link>
                    <StatusActions claimId={claim.id} currentStatus={claim.status} />
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                  没有符合条件的报销单。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
