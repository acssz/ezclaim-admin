import { formatDateTime, formatRelative } from "@/lib/utils/format";
import type { AuditEvent } from "@/types/api";

export function AuditTable({ events }: { events: AuditEvent[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table table-hover">
        <thead>
          <tr>
            <th style={{ width: "220px" }}>发生时间</th>
            <th>实体</th>
            <th>动作</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <div>{formatDateTime(event.occurredAt)}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {formatRelative(event.occurredAt)}
                </div>
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>{event.entityType}</div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>ID: {event.entityId}</div>
              </td>
              <td>
                <span className="badge" style={{ background: "rgba(56, 189, 248, 0.18)", color: "#0284c7" }}>
                  {event.action}
                </span>
              </td>
              <td style={{ minWidth: "320px" }}>
                {event.data && Object.keys(event.data).length > 0 ? (
                  <pre
                    style={{
                      background: "rgba(15, 23, 42, 0.05)",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      maxHeight: "200px",
                      overflow: "auto",
                      fontSize: "0.8rem",
                    }}
                  >
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                ) : (
                  <span className="text-muted">无附加数据</span>
                )}
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                没有符合条件的审计事件。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
