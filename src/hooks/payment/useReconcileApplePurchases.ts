import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FindersBilling } from "@/lib/billing/finders-billing";
import { PAYMENT_ALREADY_PROCESSED_CODE } from "@/constants/payment/payment.constant";
import { invalidateCreditQueries } from "@/hooks/credit";
import { useVerifyApplePayment } from "@/hooks/payment/useVerifyApplePayment";
import { extractPortoneErrorCode } from "./usePurchaseCreditPortone";
import { isIosApp } from "@/utils/platform";

// 결제됐지만 검증/종료가 누락된 Apple 트랜잭션을 진입 시 복구
export function useReconcileApplePurchases() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useVerifyApplePayment();

  useEffect(() => {
    if (!isIosApp()) return;

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
            transactionId: purchase.purchaseToken,
          });
        } catch (error) {
          // 이미 충전된 거래(PAYMENT_410)는 종료만 마저 진행, 그 외는 다음 진입 때 재시도
          if (
            extractPortoneErrorCode(error) !== PAYMENT_ALREADY_PROCESSED_CODE
          ) {
            continue;
          }
          // 검증 성공 경로(onSuccess)와 달리 여기선 캐시 무효화가 안 되므로 직접 갱신
          invalidateCreditQueries(queryClient);
        }
        await FindersBilling.finishPurchase({
          purchaseToken: purchase.purchaseToken,
        }).catch(() => undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mutateAsync, queryClient]);
}
