import { axiosInstance } from "@/lib/axiosInstance";
import { tokenStorage } from "@/utils/tokenStorage";
import type { ApiResponse } from "@/types/common/apiResponse";

export type LogoutReqDto = {
  refreshToken: string;
};

export type LogoutResData = Record<string, never>;
export type LogoutResponse = ApiResponse<LogoutResData>;

export async function logout(): Promise<LogoutResponse> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axiosInstance.post<LogoutResponse>("/auth/logout", {
    refreshToken,
  } satisfies LogoutReqDto);

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
