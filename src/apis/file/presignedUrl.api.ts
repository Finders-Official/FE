// src/apis/file/issuePresignedUrl.api.ts
import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PresignedUrlIssueReqDto,
  PresignedUrlIssueResDto,
} from "@/types/file/presignedUrl";

export async function issuePresignedUrl(
  payload: PresignedUrlIssueReqDto,
): Promise<ApiResponse<PresignedUrlIssueResDto>> {
  const res = await axiosInstance.post<ApiResponse<PresignedUrlIssueResDto>>(
    "/files/presigned-url",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
