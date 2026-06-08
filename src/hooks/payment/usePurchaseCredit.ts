import { useState } from "react";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { useVerifyGooglePayment } from "@/hooks/payment/useVerifyGooglePayment";
import type { CreditProduct } from "@/types/credit";

export type PurchaseOutcome =
  | { status: "success" }
  | { status: "canceled" }
  | { status: "pending" }
  | { status: "fail"; errorCode?: string };

// Google Play 결제 시트 호출/서버 검증까지 묶은 use case.
export function usePurchaseCredit() {
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
      await verify.mutateAsync({
        // 검증엔 이미 검증된 SKU 사용 (브릿지 purchase.productId 의존 제거)
        productId: sku,
        purchaseToken: purchase.purchaseToken,
        orderId: purchase.orderId ?? undefined,
      });
      return { status: "success" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "USER_CANCELED") {
        return { status: "canceled" };
      }
      if (message === "PENDING") {
        return { status: "pending" };
      }
      return { status: "fail", errorCode: message || undefined };
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseCredit, isPurchasing: isPurchasing || verify.isPending };
}
