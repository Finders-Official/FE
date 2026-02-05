import type { PresignedUrlIssueResDto } from "@/types/file/presignedUrl";

export function pickPresignedPutUrl(dto: PresignedUrlIssueResDto): string {
  if (!dto.url || dto.url.length === 0) {
    throw new Error("Presigned PUT url is missing in response");
  }
  return dto.url;
}

export function deriveObjectUrlFromPresignedPutUrl(putUrl: string): string {
  const u = new URL(putUrl);
  u.search = "";
  u.hash = "";
  return u.toString();
}

export function pickUploadedFilePublicUrlOrKey(
  dto: PresignedUrlIssueResDto,
  putUrl: string,
): string {
  if (dto.objectPath && dto.objectPath.length > 0) {
    return dto.objectPath;
  }
  // 응답에 없으면 putUrl에서 query 제거한 값으로 대체
  return deriveObjectUrlFromPresignedPutUrl(putUrl);
}
