import { useEffect } from "react";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { useVerifyGooglePayment } from "@/hooks/payment/useVerifyGooglePayment";
import { isAndroidApp } from "@/utils/platform";

// 결제됐지만 검증이 누락된 Google 구매를 진입 시 서버로 재전송해 복구
export function useReconcileGooglePurchases() {
  const { mutateAsync } = useVerifyGooglePayment();

  useEffect(() => {
    if (!isAndroidApp()) return;

    let cancelled = false;
    void (async () => {
      const owned = await FindersBilling.getOwnedPurchases().catch(() => null);
      if (!owned) return;

      for (const purchase of owned.purchases) {
        if (cancelled) break;
        if (!purchase.productId) continue;
        try {
          await mutateAsync({
            productId: purchase.productId,
            purchaseToken: purchase.purchaseToken,
            orderId: purchase.orderId ?? undefined,
          });
        } catch {
          // 일시 실패는 다음 진입 때 다시 시도
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mutateAsync]);
}
