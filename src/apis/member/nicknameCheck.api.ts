import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { NicknameCheckData } from "@/types/member";

export async function nicknameCheck(
  nickname: string,
): Promise<ApiResponse<NicknameCheckData>> {
  const res = await axiosInstance.get<ApiResponse<NicknameCheckData>>(
    "/users/nickname/check",
    { params: { nickname } },
  );

  const body = res.data;

  // ApiResponse success가 false면 에러로 처리
  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
