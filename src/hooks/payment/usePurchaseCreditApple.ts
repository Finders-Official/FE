import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { PAYMENT_ALREADY_PROCESSED_CODE } from "@/constants/payment/payment.constant";
import { invalidateCreditQueries } from "@/hooks/credit";
import { useVerifyApplePayment } from "@/hooks/payment/useVerifyApplePayment";
import { extractPortoneErrorCode } from "./usePurchaseCreditPortone";
import type { PurchaseOutcome } from "./usePurchaseCredit";
import type { CreditProduct } from "@/types/credit";

// App Store 결제 시트 호출/서버 검증/트랜잭션 종료까지
// Apple은 서버 consume이 없어 검증(충전 확정) 후 클라이언트가 finish
export function usePurchaseCreditApple() {
  const queryClient = useQueryClient();
  const verify = useVerifyApplePayment();
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
          // 검증엔 이미 검증된 SKU 사용
          productId: sku,
          transactionId: purchase.purchaseToken,
        });
      } catch (error) {
        // 이미 충전된 거래면 잔액 캐시만 갱신하고 종료로
        if (extractPortoneErrorCode(error) !== PAYMENT_ALREADY_PROCESSED_CODE) {
          throw error;
        }
        invalidateCreditQueries(queryClient);
      }

      // 충전이 확정된 뒤에만 finish
      await FindersBilling.finishPurchase({
        purchaseToken: purchase.purchaseToken,
      }).catch(() => undefined);

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
