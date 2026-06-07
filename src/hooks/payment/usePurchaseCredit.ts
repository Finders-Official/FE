import { useState } from "react";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { useVerifyGooglePayment } from "@/hooks/payment/useVerifyGooglePayment";
import type { CreditProduct } from "@/types/credit";

export type PurchaseOutcome =
  | { status: "success" }
  | { status: "canceled" }
  | { status: "fail"; errorCode?: string };

// Google Play 결제 시트 호출/서버 검증까지 묶은 use case.
export function usePurchaseCredit() {
  const verify = useVerifyGooglePayment();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseCredit = async (
    product: CreditProduct,
  ): Promise<PurchaseOutcome> => {
    if (!product.externalProductId) {
      return { status: "fail", errorCode: "MISSING_SKU" };
    }

    setIsPurchasing(true);
    try {
      const purchase = await FindersBilling.purchase({
        productId: product.externalProductId,
      });
      await verify.mutateAsync({
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        orderId: purchase.orderId ?? undefined,
      });
      return { status: "success" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "USER_CANCELED") {
        return { status: "canceled" };
      }
      return { status: "fail", errorCode: message || undefined };
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseCredit, isPurchasing: isPurchasing || verify.isPending };
}
