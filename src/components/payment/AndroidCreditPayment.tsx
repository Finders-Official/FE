import { useNavigate } from "react-router";
import { CTA_Button } from "@/components/common";
import {
  PaymentProductSection,
  PaymentRefundNotice,
  PaymentSummary,
} from "@/components/payment";
import { usePurchaseCredit } from "@/hooks/payment";
import type { CreditProduct } from "@/types/credit";
import type { PaymentResultFail, PaymentResultSuccess } from "@/types/payment";

interface AndroidCreditPaymentProps {
  product: CreditProduct;
}

// Android: 카드/간편결제/PG 약관 없이 Google Play 네이티브 결제 시트로
export function AndroidCreditPayment({ product }: AndroidCreditPaymentProps) {
  const navigate = useNavigate();
  const { purchaseCredit, isPurchasing } = usePurchaseCredit();

  const handlePay = async () => {
    const outcome = await purchaseCredit(product);
    if (outcome.status === "canceled") return;

    if (outcome.status === "success") {
      const state: PaymentResultSuccess = {
        status: "success",
        product,
        methodLabel: "Google Play",
      };
      navigate("/mypage/credit/payment/result", { state });
      return;
    }

    // TODO: PENDING(가상계좌 등) 전용 결과 화면 디자인 필요 — 현재는 허브로 복귀, reconciliation이 정산
    if (outcome.status === "pending") {
      navigate("/mypage/credit", { replace: true });
      return;
    }

    const state: PaymentResultFail = {
      status: "fail",
      errorCode: outcome.errorCode,
    };
    navigate("/mypage/credit/payment/result", { state });
  };

  return (
    <div className="flex flex-col pb-[6.5rem]">
      <div className="-mx-4">
        <PaymentProductSection product={product} />
        <PaymentSummary
          productPrice={product.price}
          totalPrice={product.price}
        />
        <section className="px-4 py-5">
          <PaymentRefundNotice />
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-120 border-t border-neutral-700 bg-neutral-900 px-4 py-5">
        <CTA_Button
          text="결제하기"
          size="xlarge"
          color={isPurchasing ? "black" : "orange"}
          disabled={isPurchasing}
          onClick={handlePay}
        />
      </footer>
    </div>
  );
}
