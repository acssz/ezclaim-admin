import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneStyles: Record<string, React.CSSProperties> = {
    default: { background: "rgba(148, 163, 184, 0.18)", color: "#475569" },
    success: { background: "rgba(74, 222, 128, 0.2)", color: "#16a34a" },
    warning: { background: "rgba(251, 191, 36, 0.2)", color: "#b45309" },
    danger: { background: "rgba(248, 113, 113, 0.2)", color: "#b91c1c" },
  };

  return (
    <span className="badge" style={toneStyles[tone] ?? toneStyles.default}>
      {children}
    </span>
  );
}
