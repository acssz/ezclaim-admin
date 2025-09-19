"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ClientSession } from "@/types/auth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayoutShell({
  session,
  children,
}: {
  session: ClientSession | null;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="dashboard-shell" data-nav-open={mobileNavOpen ? "true" : undefined}>
      <Sidebar
        session={session}
        mobileNavOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-label="关闭导航"
        />
      )}
      <div className="main-layout">
        <Topbar
          session={session}
          onToggleNav={() => setMobileNavOpen((prev) => !prev)}
          navOpen={mobileNavOpen}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
