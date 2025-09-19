import { PageHeader } from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/client";
import type { Tag } from "@/types/api";
import { CreateTagForm } from "./_components/CreateTagForm";
import { TagsTable } from "./_components/TagsTable";

export default async function TagsPage() {
  const tags = await apiFetch<Tag[]>("/api/tags", { auth: true });

  return (
    <div className="grid" style={{ gap: "2rem" }}>
      <PageHeader
        title="标签管理"
        description="创建、查看和删除标签，以便对报销单进行快速分类。"
      />
      <CreateTagForm />
      <TagsTable tags={tags} />
    </div>
  );
}
