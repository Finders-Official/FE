import { FALLBACK_PROFILE_SRC, GCS_PUBLIC_BASE } from "@/constants/gcsUrl";

type ResolveProfileSrcProps = {
  raw?: string | null;
};

export function resolveProfileSrc({ raw }: ResolveProfileSrcProps): string {
  const v = typeof raw === "string" ? raw.trim() : "";

  // null/undefined/빈문자/무효 문자열까지 fallback
  if (
    v.length === 0 ||
    v.toLowerCase() === "null" ||
    v.toLowerCase() === "undefined"
  ) {
    return FALLBACK_PROFILE_SRC;
  }

  // 업로드 직후 objectUrl
  if (v.startsWith("blob:")) return v;

  // 이미 완전한 URL
  if (/^https?:\/\//i.test(v)) return v;

  // 로컬 public 경로
  if (v.startsWith("/")) return v;

  // 스토리지 key로 보고 base 붙이기 + 인코딩(한글/공백 대응)
  const key = v.replace(/^\/+/, "");
  return `${GCS_PUBLIC_BASE}/${encodeURI(key)}`;
}
