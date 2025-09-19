"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Tag } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { removeTag } from "../actions";

export function TagsTable({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!query) return tags;
    return tags.filter((tag) =>
      tag.label.toLowerCase().includes(query.toLowerCase()) ||
      tag.id.toLowerCase().includes(query.toLowerCase())
    );
  }, [tags, query]);

  const handleDelete = (id: string) => {
    setFeedback(null);
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      const result = await removeTag(id);
      if (result.error) {
        setError(result.error);
      } else {
        setFeedback(result.success ?? "标签已删除");
      }
      router.refresh();
      setPendingId(null);
    });
  };

  return (
    <div className="content-card" style={{ display: "grid", gap: "1.25rem" }}>
      <div className="table-toolbar">
        <div>
          <h3 style={{ margin: 0 }}>已创建的标签</h3>
          <p className="text-muted" style={{ margin: "0.35rem 0 0" }}>
            共 {filtered.length} / {tags.length} 个标签。
          </p>
        </div>
        <div className="toolbar-group">
          <input
            className="input search-input"
            placeholder="搜索标签名称或 ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>名称</th>
              <th style={{ width: "20%" }}>颜色</th>
              <th>ID</th>
              <th style={{ width: "120px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tag) => (
              <tr key={tag.id}>
                <td style={{ fontWeight: 600 }}>{tag.label}</td>
                <td>
                  <span className="tag-pill" style={{ background: `${tag.color}22` }}>
                    <span className="tag-dot" style={{ background: tag.color }} />
                    {tag.color}
                  </span>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{tag.id}</td>
                <td>
                  <div className="table-actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending && pendingId === tag.id}
                      onClick={() => handleDelete(tag.id)}
                    >
                      {isPending && pendingId === tag.id ? "删除中..." : "删除"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                  没有符合条件的标签。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {feedback && (
        <div className="badge" style={{ background: "rgba(74, 222, 128, 0.2)", color: "#15803d" }}>
          {feedback}
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
