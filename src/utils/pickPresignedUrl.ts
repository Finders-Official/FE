export function pickPresignedPutUrl(dto: unknown): string {
  const r = dto as Record<string, unknown>;
  const v =
    r.url ??
    r.uploadUrl ??
    r.presignedUrl ??
    r.putUrl ??
    r.signedUrl ??
    r.signedPutUrl;

  if (typeof v !== "string" || v.length === 0) {
    throw new Error("Presigned PUT url is missing in response");
  }
  return v;
}

export function deriveObjectUrlFromPresignedPutUrl(putUrl: string): string {
  const u = new URL(putUrl);
  u.search = "";
  u.hash = "";
  return u.toString();
}

export function pickUploadedFilePublicUrlOrKey(
  dto: unknown,
  putUrl: string,
): string {
  const r = dto as Record<string, unknown>;
  const v =
    r.fileUrl ??
    r.publicUrl ??
    r.objectUrl ??
    r.downloadUrl ??
    r.path ??
    r.objectKey ??
    r.key ??
    r.fileKey ??
    r.objectName ??
    r.storagePath ??
    r.filePath ??
    r.resourceUrl;

  if (typeof v === "string" && v.length > 0) return v;

  // 응답에 없으면 putUrl에서 query 제거한 값으로 대체
  return deriveObjectUrlFromPresignedPutUrl(putUrl);
}
