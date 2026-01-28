import { axiosInstance } from "@/lib/axiosInstance";
import type {
  SocialoginCompleteData,
  SocialoginCompleteReq,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

//소셜 로그인 (웹 브라우저용)
export async function oauth(
  payload: SocialoginCompleteReq,
): Promise<ApiResponse<SocialoginCompleteData>> {
  const res = await axiosInstance.post<ApiResponse<SocialoginCompleteData>>(
    "/auth/social/login/code",
    payload,
  );
  const body = res.data;

  //apiresponse 내부 success 가 false로 올 경우
  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
