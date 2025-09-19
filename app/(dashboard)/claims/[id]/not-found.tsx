import Link from "next/link";

export default function ClaimNotFound() {
  return (
    <div className="content-card" style={{ display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>未找到报销单</h2>
      <p className="text-muted" style={{ margin: 0 }}>
        该报销单可能已被删除或您没有访问权限。
      </p>
      <Link href="/claims" className="link">
        返回报销单列表
      </Link>
    </div>
  );
}
