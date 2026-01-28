import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { EditMeReqDto, MyPageDataDto } from "@/types/mypage/info";

export async function me(): Promise<ApiResponse<MyPageDataDto>> {
  const res =
    await axiosInstance.get<ApiResponse<MyPageDataDto>>("/members/me");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

export async function editMe(
  payload: EditMeReqDto,
): Promise<ApiResponse<MyPageDataDto>> {
  const res = await axiosInstance.patch<ApiResponse<MyPageDataDto>>(
    "/members/me",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
