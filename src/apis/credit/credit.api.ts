import { axiosInstance } from "@/lib/axiosInstance";
import type {
  CreditHistoriesResponse,
  CreditPurchasePageResponse,
} from "@/types/credit";

// 크레딧 구매 페이지 조회 (보유 크레딧 + 구매 가능 상품 목록)
export async function getCreditPurchasePage(): Promise<CreditPurchasePageResponse> {
  const res = await axiosInstance.get<CreditPurchasePageResponse>(
    "/credits/purchase-page",
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 크레딧 충전/사용 내역 조회 (최신순)
export async function getCreditHistories(): Promise<CreditHistoriesResponse> {
  const res =
    await axiosInstance.get<CreditHistoriesResponse>("/credits/histories");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
