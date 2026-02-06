// src/utils/presigned.ts
import type { PresignedUrlIssueResDto } from "@/types/file/presignedUrl";

export function pickPresignedPutUrl(dto: PresignedUrlIssueResDto): string {
  const r = dto as unknown as Record<string, unknown>;
  const v = r.url ?? r.uploadUrl ?? r.presignedUrl ?? r.putUrl ?? r.signedUrl;

  if (typeof v !== "string" || v.length === 0) {
    throw new Error("Presigned PUT url is missing in response");
  }
  return v;
}

export function pickUploadedFilePublicUrl(
  dto: PresignedUrlIssueResDto,
): string {
  const r = dto as unknown as Record<string, unknown>;
  const v =
    r.fileUrl ??
    r.publicUrl ??
    r.objectUrl ??
    r.downloadUrl ??
    r.path ??
    r.objectKey;

  if (typeof v !== "string" || v.length === 0) {
    throw new Error("Uploaded file url/key is missing in response");
  }
  return v;
}
