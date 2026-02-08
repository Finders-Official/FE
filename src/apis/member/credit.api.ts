import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

// creditBalance만 필요하므로 최소 타입만 정의
interface CreditBalanceData {
  roleData: {
    user: {
      creditBalance: number;
    } | null;
  };
}

export async function getCreditBalance(): Promise<
  ApiResponse<{ creditBalance: number }>
> {
  const res =
    await axiosInstance.get<ApiResponse<CreditBalanceData>>("/members/me");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  const creditBalance = body.data.roleData.user?.creditBalance ?? 0;

  return {
    ...body,
    data: {
      creditBalance,
    },
  };
}
