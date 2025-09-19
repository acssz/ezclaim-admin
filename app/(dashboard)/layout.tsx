import { DashboardLayoutShell } from "@/components/layout/DashboardLayoutShell";
import { getSession, toClientSession } from "@/lib/auth/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = toClientSession(getSession());

  return <DashboardLayoutShell session={session}>{children}</DashboardLayoutShell>;
}
