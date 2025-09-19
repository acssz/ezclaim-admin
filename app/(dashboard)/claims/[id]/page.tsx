import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/client";
import { CLAIM_STATUS_CLASS, CLAIM_STATUS_LABELS } from "@/lib/utils/claims";
import { formatCurrency, formatDateTime, formatRelative } from "@/lib/utils/format";
import type { Claim, Photo } from "@/types/api";
import { StatusActions } from "../_components/StatusActions";

interface ClaimPageProps {
  params: {
    id: string;
  };
}

function renderPayout(payout: Claim["payout"]) {
  if (!payout) {
    return <span className="text-muted">无支付信息</span>;
  }

  const entries = Object.entries(payout).filter(([, value]) => value);
  if (entries.length === 0) {
    return <span className="text-muted">无支付信息</span>;
  }

  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        rowGap: "0.5rem",
        columnGap: "1rem",
        margin: 0,
      }}
    >
      {entries.map(([key, value]) => (
        <Fragment key={key}>
          <dt
            className="text-muted"
            style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            {key}
          </dt>
          <dd style={{ margin: 0, fontSize: "0.95rem" }}>{String(value)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

type PhotoWithUrl = Photo & { downloadUrl: string | null };

function extractDownloadUrl(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === "string") {
    return payload;
  }
  if (typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    const key = ["url", "downloadUrl", "href", "signedUrl"].find((candidate) => {
      const value = data[candidate];
      return typeof value === "string" && value.length > 0;
    });
    if (key) {
      return data[key] as string;
    }
  }
  return null;
}

function isPdfAsset(photo: PhotoWithUrl): boolean {
  const key = photo.key?.toLowerCase() ?? "";
  if (key.endsWith(".pdf")) return true;
  const url = photo.downloadUrl?.toLowerCase() ?? "";
  return url.includes(".pdf");
}

export default async function ClaimDetailPage({ params }: ClaimPageProps) {
  const { id } = params;
  let claim: Claim | null = null;

  try {
    claim = await apiFetch<Claim>(`/api/claims/${id}`, { auth: true });
  } catch (error) {
    console.error(error);
  }

  if (!claim) {
    notFound();
  }

  const photosWithUrls: PhotoWithUrl[] = claim.photos && claim.photos.length > 0
    ? await Promise.all(
        claim.photos.map(async (photo) => {
          try {
            const response = await apiFetch<unknown>(
              `/api/photos/${photo.id}/download-url`,
              { auth: true },
            );
            const downloadUrl = extractDownloadUrl(response);
            return { ...photo, downloadUrl: downloadUrl ?? null };
          } catch (error) {
            console.error(`Failed to load photo ${photo.id}`, error);
            return { ...photo, downloadUrl: null };
          }
        }),
      )
    : [];

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <Link
        href="/claims"
        className="link"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
      >
        ← 返回列表
      </Link>
      <PageHeader
        title={claim.title}
        description={`报销单 ID：${claim.id}`}
        actions={
          <span className={CLAIM_STATUS_CLASS[claim.status]}>
            {CLAIM_STATUS_LABELS[claim.status]}
          </span>
        }
      />

      <div className="content-card" style={{ display: "grid", gap: "1.5rem" }}>
        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>基本信息</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <div className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                金额
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                {formatCurrency(claim.amount, claim.currency)}
              </div>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                收款人
              </div>
              <div style={{ fontSize: "1rem" }}>{claim.recipient ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                创建时间
              </div>
              <div>{formatDateTime(claim.createdAt)}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                {formatRelative(claim.createdAt)}
              </div>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                更新时间
              </div>
              <div>{formatDateTime(claim.updatedAt)}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                {formatRelative(claim.updatedAt)}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>报销内容</h3>
          <p style={{ whiteSpace: "pre-line", fontSize: "0.95rem", margin: 0 }}>
            {claim.description ?? "无描述"}
          </p>
        </section>

        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>关联标签</h3>
          {claim.tags && claim.tags.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {claim.tags.map((tag) => (
                <span key={tag.id} className="tag-pill" style={{ background: `${tag.color}22` }}>
                  <span className="tag-dot" style={{ background: tag.color }} />
                  {tag.label}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted">无标签</span>
          )}
        </section>

        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>附件</h3>
          {photosWithUrls.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              {photosWithUrls.map((photo) => {
                const label = photo.key ?? photo.id;
                const isPdf = isPdfAsset(photo);
                return (
                  <figure
                    key={photo.id}
                    style={{
                      margin: 0,
                      display: "grid",
                      gap: "0.5rem",
                    }}
                  >
                    {photo.downloadUrl ? (
                      isPdf ? (
                        <div
                          style={{
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.08)",
                            background: "rgba(15, 23, 42, 0.05)",
                          }}
                        >
                          <iframe
                            src={photo.downloadUrl}
                            title={label}
                            style={{
                              width: "100%",
                              height: "320px",
                              border: "none",
                              background: "#fff",
                            }}
                          />
                        </div>
                      ) : (
                        <a
                          href={photo.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "block", borderRadius: "0.75rem", overflow: "hidden" }}
                        >
                          <img
                            src={photo.downloadUrl}
                            alt={label}
                            loading="lazy"
                            style={{
                              width: "100%",
                              display: "block",
                              aspectRatio: "4 / 3",
                              objectFit: "cover",
                              background: "rgba(15, 23, 42, 0.05)",
                            }}
                          />
                        </a>
                      )
                    ) : (
                      <div
                        className="text-muted"
                        style={{
                          padding: "1.5rem",
                          borderRadius: "0.75rem",
                          background: "rgba(15, 23, 42, 0.05)",
                          textAlign: "center",
                        }}
                      >
                        无法加载预览
                      </div>
                    )}
                    <figcaption style={{ fontSize: "0.85rem" }}>
                      <div style={{ fontWeight: 600, wordBreak: "break-all" }}>{label}</div>
                      {photo.uploadedAt && (
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          上传于 {formatDateTime(photo.uploadedAt)}
                        </div>
                      )}
                      {photo.downloadUrl && (
                        <a
                          href={photo.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: "0.8rem",
                            color: "#2563eb",
                            textDecoration: "underline",
                          }}
                        >
                          在新标签中打开附件
                        </a>
                      )}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <span className="text-muted">无附件</span>
          )}
        </section>

        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>支付信息</h3>
          {renderPayout(claim.payout)}
        </section>

        <section>
          <h3 style={{ margin: "0 0 0.75rem" }}>状态变更</h3>
          <StatusActions
            claimId={claim.id}
            currentStatus={claim.status}
            showPlaceholder
          />
        </section>
      </div>
    </div>
  );
}
