import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { getSession } from "@/lib/auth/session";

type PageProps = {
  searchParams: {
    redirect?: string;
  };
};

export default function LoginPage({ searchParams }: PageProps) {
  const session = getSession();
  if (session) {
    redirect(searchParams.redirect || "/claims");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div className="card" style={{ maxWidth: "420px", width: "100%" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>EzClaim 管理后台</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            使用管理员凭证登录以管理标签、报销单和审计事件。
          </p>
          {searchParams.redirect && (
            <p className="text-muted" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
              继续访问：{searchParams.redirect}
            </p>
          )}
        </div>
        <LoginForm />
        <p className="text-muted" style={{ marginTop: "2rem", fontSize: "0.85rem" }}>
          Demo 账户：<strong>admin / ezclaim-password</strong>
        </p>
      </div>
    </main>
  );
}
