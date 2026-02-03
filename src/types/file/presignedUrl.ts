export const PRESIGNED_UPLOAD_CATEGORIES = {
  PROFILE: "PROFILE",
  POST_IMAGE: "POST_IMAGE",
  TEMP_PUBLIC: "TEMP_PUBLIC",
  RESTORATION_ORIGINAL: "RESTORATION_ORIGINAL",
  RESTORATION_MASK: "RESTORATION_MASK",
  RESTORATION_RESTORED: "RESTORATION_RESTORED",
  INQUIRY: "INQUIRY",
} as const;

export type PresignedUploadCategory =
  (typeof PRESIGNED_UPLOAD_CATEGORIES)[keyof typeof PRESIGNED_UPLOAD_CATEGORIES];

export type PresignedUrlIssueReqDto = {
  category: PresignedUploadCategory;
  fileName: string;
  memberId: number;
};

export type PresignedUrlIssueResDto = {
  url: string;
  objectPath: string;
  expiresAtEpochSecond: number;
};

export type UploadToPresignedUrlArgs = {
  url: string; // presignedUrl API에서 받은 url
  file: File | Blob; // 업로드할 파일(바이너리)
  contentType: string; // 예: file.type (image/jpeg)
};
