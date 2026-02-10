import { FALLBACK_PROFILE_SRC, GCS_PUBLIC_BASE } from "@/constants/gcsUrl";

type resolveProfieSrcProps = {
  raw?: string;
};

export function resolveProfileSrc({ raw }: resolveProfieSrcProps) {
  if (!raw) return FALLBACK_PROFILE_SRC;

  // 업로드 직후 objectUrl
  if (raw.startsWith("blob:")) return raw;

  // 이미 완전한 URL
  if (/^https?:\/\//i.test(raw)) return raw;

  // 로컬 public 경로
  if (raw.startsWith("/")) return raw;

  // 스토리지 key로 보고 base 붙이기 + 인코딩(한글/공백 대응)
  const key = raw.replace(/^\/+/, "");
  return `${GCS_PUBLIC_BASE}/${encodeURI(key)}`;
}
