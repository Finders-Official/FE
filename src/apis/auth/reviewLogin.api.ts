import { axiosInstance } from "@/lib/axiosInstance";
import type { ReviewLoginData, ReviewLoginReq } from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

// 스토어 심사용 로그인 (소셜 우회)
export async function reviewLogin(
  payload: ReviewLoginReq,
): Promise<ApiResponse<ReviewLoginData>> {
  const res = await axiosInstance.post<ApiResponse<ReviewLoginData>>(
    "/auth/review/login",
    payload,
  );
  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
