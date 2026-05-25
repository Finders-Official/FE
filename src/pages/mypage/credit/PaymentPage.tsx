import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { CTA_Button } from "@/components/common";
import {
  CardSelectBottomSheet,
  CardSelectButton,
  EasyPayRadioList,
  PaymentMethodTabs,
  PaymentOrdererSection,
  PaymentProductSection,
  PaymentRefundNotice,
  PaymentSection,
  PaymentSummary,
  PaymentTermsAgreement,
} from "@/components/payment";
import { CREDIT_CARD_OPTIONS } from "@/constants/payment/payment.constant";
import { MOCK_ORDERER } from "@/constants/payment/payment.mock";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";
import type { EasyPayProvider, PaymentMethod } from "@/types/payment";

export function PaymentPage() {
  const [product] = useState(() => usePaymentOrderStore.getState().product);
  const clear = usePaymentOrderStore((s) => s.clear);

  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [cardId, setCardId] = useState<string | null>(null);
  const [easyPayId, setEasyPayId] = useState<EasyPayProvider | null>(null);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (product) clear();
  }, [product, clear]);

  const selectedCardName = useMemo(
    () => CREDIT_CARD_OPTIONS.find((c) => c.id === cardId)?.name ?? null,
    [cardId],
  );

  const isMethodReady =
    method === "CARD"
      ? cardId !== null
      : method === "EASY_PAY"
        ? easyPayId !== null
        : true;
  const isPayable = agreed && isMethodReady;

  if (!product) {
    return <Navigate to="/mypage/credit" replace />;
  }

  return (
    <div className="flex flex-col pb-[6.5rem]">
      <div className="-mx-4">
        <PaymentOrdererSection orderer={MOCK_ORDERER} />
        <PaymentProductSection product={product} />

        <PaymentSection title="결제 수단">
          <div
            className={`flex flex-col ${method === "EASY_PAY" ? "gap-4" : "gap-2"}`}
          >
            <PaymentMethodTabs value={method} onChange={setMethod} />
            {method === "CARD" && (
              <CardSelectButton
                selectedName={selectedCardName}
                onClick={() => setIsCardSheetOpen(true)}
              />
            )}
            {method === "EASY_PAY" && (
              <EasyPayRadioList value={easyPayId} onChange={setEasyPayId} />
            )}
          </div>
        </PaymentSection>

        <PaymentSummary
          productPrice={product.price}
          totalPrice={product.price}
        />

        <section className="flex flex-col gap-3.5 px-4 py-5">
          <PaymentRefundNotice />
          <PaymentTermsAgreement
            agreed={agreed}
            onAgreedChange={setAgreed}
            onViewTerm={() => {}}
          />
        </section>
      </div>

      <CardSelectBottomSheet
        open={isCardSheetOpen}
        onClose={() => setIsCardSheetOpen(false)}
        selectedCardId={cardId}
        onSelect={setCardId}
      />

      <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-120 border-t border-neutral-700 bg-neutral-900 px-4 py-5">
        <CTA_Button
          text="결제하기"
          size="xlarge"
          color={isPayable ? "orange" : "black"}
          disabled={!isPayable}
        />
      </footer>
    </div>
  );
}
