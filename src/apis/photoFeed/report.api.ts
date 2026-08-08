import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

/** 신고 대상 타입 */
export type ReportTargetType = "POST" | "COMMENT";

/** 신고 사유 */
export type ReportReason = "SPAM" | "PORN" | "ABUSE" | "PRIVACY" | "ILLEGAL";

export type ReportRequest = {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
};

/**
 * 게시글/댓글 신고
 * 타인이 작성한 게시글 또는 댓글을 신고한다.
 */
export async function reportContent(payload: ReportRequest): Promise<boolean> {
  const res = await axiosInstance.post<ApiResponse<Record<string, never>>>(
    "/reports",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return true;
}
