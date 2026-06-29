import { useNavigate } from "react-router";
import { CTA_Button } from "@/components/common";
import {
  PaymentProductSection,
  PaymentRefundNotice,
  PaymentSummary,
} from "@/components/payment";
import { usePurchaseCreditApple } from "@/hooks/payment";
import type { CreditProduct } from "@/types/credit";
import type { PaymentResultFail, PaymentResultSuccess } from "@/types/payment";

interface AppleCreditPaymentProps {
  product: CreditProduct;
}

// iOS: 카드/간편결제/PG 약관 없이 App Store 네이티브 결제 시트로
export function AppleCreditPayment({ product }: AppleCreditPaymentProps) {
  const navigate = useNavigate();
  const { purchaseCredit, isPurchasing } = usePurchaseCreditApple();

  const handlePay = async () => {
    const outcome = await purchaseCredit(product);
    if (outcome.status === "canceled") return;

    if (outcome.status === "success") {
      const state: PaymentResultSuccess = {
        status: "success",
        product,
        methodLabel: "App Store",
      };
      navigate("/mypage/credit/payment/result", { state, replace: true });
      return;
    }

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
