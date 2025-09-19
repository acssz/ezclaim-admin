import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1.5rem",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>{title}</h2>
        {description && (
          <p className="text-muted" style={{ margin: 0, maxWidth: "52ch" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>{actions}</div>}
    </div>
  );
}
