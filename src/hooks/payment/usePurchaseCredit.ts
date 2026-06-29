import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { PAYMENT_ALREADY_PROCESSED_CODE } from "@/constants/payment/payment.constant";
import { invalidateCreditQueries } from "@/hooks/credit";
import { useVerifyGooglePayment } from "@/hooks/payment/useVerifyGooglePayment";
import { extractPortoneErrorCode } from "./usePurchaseCreditPortone";
import type { CreditProduct } from "@/types/credit";

export type PurchaseOutcome =
  | { status: "success" }
  | { status: "canceled" }
  | { status: "pending" }
  | { status: "fail"; errorCode?: string };

// Google Play 결제 시트 호출/서버 검증까지 묶은 use case.
export function usePurchaseCredit() {
  const queryClient = useQueryClient();
  const verify = useVerifyGooglePayment();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseCredit = async (
    product: CreditProduct,
  ): Promise<PurchaseOutcome> => {
    const sku = product.externalProductId;
    if (!sku) {
      return { status: "fail", errorCode: "MISSING_SKU" };
    }

    setIsPurchasing(true);
    try {
      const purchase = await FindersBilling.purchase({ productId: sku });
      try {
        await verify.mutateAsync({
          // 검증엔 이미 검증된 SKU 사용 (브릿지 purchase.productId 의존 제거)
          productId: sku,
          purchaseToken: purchase.purchaseToken,
          orderId: purchase.orderId ?? undefined,
        });
      } catch (error) {
        // 이미 처리된 결제(웹훅/네트워크 레이스)는 실패 아님, 잔액 캐시만 갱신
        if (extractPortoneErrorCode(error) !== PAYMENT_ALREADY_PROCESSED_CODE) {
          throw error;
        }
        invalidateCreditQueries(queryClient);
      }
      return { status: "success" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "USER_CANCELED") {
        return { status: "canceled" };
      }
      if (message === "PENDING") {
        return { status: "pending" };
      }
      return { status: "fail", errorCode: extractPortoneErrorCode(error) };
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseCredit, isPurchasing: isPurchasing || verify.isPending };
}
