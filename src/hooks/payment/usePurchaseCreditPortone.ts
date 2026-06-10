import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { preRegisterPortonePayment } from "@/apis/payment";
import { PAYMENT_ALREADY_PROCESSED_CODE } from "@/constants/payment/payment.constant";
import { invalidateCreditQueries } from "@/hooks/credit";
import {
  clearPendingPortonePayment,
  savePendingPortonePayment,
} from "@/lib/payment/pendingPortonePayment";
import { requestPortoneCheckout } from "@/lib/payment/portone";
import { useCompletePortonePayment } from "./useCompletePortonePayment";
import type { PurchaseOutcome } from "./usePurchaseCredit";
import type { CreditProduct } from "@/types/credit";
import type {
  EasyPayProvider,
  PaymentMethod,
  PortonePaymentDetail,
} from "@/types/payment";

// axios 에러에서 서버 ApiResponse.code(PAYMENT_xxx) 추출
export function extractPortoneErrorCode(error: unknown): string | undefined {
  if (isAxiosError<{ code?: string }>(error)) {
    return error.response?.data?.code ?? error.code;
  }
  return error instanceof Error ? error.message : undefined;
}

// 완료 응답은 status가 FAILED일 수 있어 status 기준으로 결과 매핑
export function mapPortoneDetailToOutcome(
  detail: PortonePaymentDetail,
): PurchaseOutcome {
  if (detail.status === "PAID") {
    return { status: "success" };
  }
  if (detail.status === "FAILED") {
    return { status: "fail", errorCode: detail.failCode ?? undefined };
  }
  // 가상계좌 등 비동기 확정 상태
  return { status: "fail", errorCode: detail.status };
}

export interface PortonePurchaseParams {
  product: CreditProduct;
  method: PaymentMethod;
  cardId: string | null;
  easyPayId: EasyPayProvider | null;
  methodLabel: string;
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
}

export function usePurchaseCreditPortone() {
  const queryClient = useQueryClient();
  const complete = useCompletePortonePayment();
  const [isPurchasing, setIsPurchasing] = useState(false);

  // PG로 리다이렉트된 뒤 뒤로가기로 bfcache 복원되면 결제창 promise가 풀리지 않음
  // 복원 시점에 진행 상태를 리셋
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setIsPurchasing(false);
      clearPendingPortonePayment();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const purchaseCredit = async (
    params: PortonePurchaseParams,
  ): Promise<PurchaseOutcome> => {
    setIsPurchasing(true);
    try {
      const preRegistered = await preRegisterPortonePayment({
        creditProductId: params.product.productId,
      });
      const { paymentId, orderName, amount } = preRegistered.data;

      // 리다이렉트 복귀 시 결과 화면 복원
      savePendingPortonePayment({
        paymentId,
        product: params.product,
        methodLabel: params.methodLabel,
      });

      const checkout = await requestPortoneCheckout({
        paymentId,
        orderName,
        // 사전등록에서 서버가 확정한 금액 사용
        totalAmount: amount,
        method: params.method,
        cardId: params.cardId,
        easyPayId: params.easyPayId,
        customer: params.customer,
      });

      if (checkout.status !== "success") {
        clearPendingPortonePayment();
        return checkout;
      }

      const completed = await complete.mutateAsync({ paymentId });
      clearPendingPortonePayment();
      return mapPortoneDetailToOutcome(completed.data);
    } catch (error) {
      clearPendingPortonePayment();
      const errorCode = extractPortoneErrorCode(error);
      // 이미 처리된 결제, 웹훅이 먼저 충전했을 수 있어 잔액 캐시를 미리 갱신
      if (errorCode === PAYMENT_ALREADY_PROCESSED_CODE) {
        invalidateCreditQueries(queryClient);
      }
      return { status: "fail", errorCode };
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseCredit, isPurchasing: isPurchasing || complete.isPending };
}
