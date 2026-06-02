import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export type LogoutResData = Record<string, never>;
export type LogoutResponse = ApiResponse<LogoutResData>;

export async function logout(): Promise<LogoutResponse> {
  const res = await axiosInstance.post<LogoutResponse>("/auth/logout");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
