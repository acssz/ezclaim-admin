import clsx from "clsx";
import type { ClientSession } from "@/types/auth";
import { NavLink } from "./NavLink";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/claims", label: "报销单" },
  { href: "/tags", label: "标签管理" },
  { href: "/audit-events", label: "审计事件" },
];

interface SidebarProps {
  session: ClientSession | null;
  mobileNavOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ session, mobileNavOpen, onClose }: SidebarProps) {
  return (
    <aside className={clsx("sidebar", mobileNavOpen && "sidebar--open")}>
      <div className="sidebar-header">
        <div>
          <h2>EzClaim 管理台</h2>
          <p className="text-muted" style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>
            欢迎回来，{session?.subject ?? "访客"}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="关闭导航"
          >
            ✕
          </button>
        )}
      </div>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            onNavigate={onClose}
          />
        ))}
      </nav>
      <div>
        <LogoutButton />
      </div>
    </aside>
  );
}
