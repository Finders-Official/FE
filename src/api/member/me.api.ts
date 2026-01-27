import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { MyPageDataDto } from "@/types/mypage/info";

export async function me(): Promise<ApiResponse<MyPageDataDto>> {
  const res =
    await axiosInstance.get<ApiResponse<MyPageDataDto>>("/members/me");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
