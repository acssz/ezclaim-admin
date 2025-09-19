import type { ClientSession } from "@/types/auth";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface TopbarProps {
  session: ClientSession | null;
  onToggleNav?: () => void;
  navOpen?: boolean;
}

export function Topbar({ session, onToggleNav, navOpen }: TopbarProps) {
  const expiresLabel = session?.expiresAt
    ? formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true, locale: zhCN })
    : null;

  return (
    <header className="topbar">
      <div className="topbar-leading">
        {onToggleNav && (
          <button
            type="button"
            className="topbar-menu"
            onClick={onToggleNav}
            aria-label={navOpen ? "关闭导航" : "打开导航"}
            aria-expanded={navOpen ? "true" : "false"}
          >
            ☰
          </button>
        )}
        <div>
          <h1>EzClaim 管理后台</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
            {session?.subject ? `当前用户：${session.subject}` : "未登录"}
            {expiresLabel ? ` · Token ${expiresLabel} 过期` : ""}
          </p>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="badge">后台版本 0.1.0</div>
      </div>
    </header>
  );
}
