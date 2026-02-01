import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  EditMeReqDto,
  MyPageDataDto,
  WithDrawResponse,
} from "@/types/mypage/info";

//1. 내 정보 조회
export async function me(): Promise<ApiResponse<MyPageDataDto>> {
  const res =
    await axiosInstance.get<ApiResponse<MyPageDataDto>>("/members/me");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

//2. 내 정보 수정
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

//3. 회원 탈퇴
export async function withDrawMe(): Promise<ApiResponse<WithDrawResponse>> {
  const res =
    await axiosInstance.delete<ApiResponse<WithDrawResponse>>("/users/me");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
