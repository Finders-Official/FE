import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";
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
  PaymentTermsOverlay,
} from "@/components/payment";
import {
  CREDIT_CARD_OPTIONS,
  EASY_PAY_OPTIONS,
} from "@/constants/payment/payment.constant";
import { MOCK_ORDERER } from "@/constants/payment/payment.mock";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";
import type {
  EasyPayProvider,
  PaymentMethod,
  PaymentResultSuccess,
  PaymentTermsSection,
} from "@/types/payment";

export function PaymentPage() {
  const navigate = useNavigate();
  const [product] = useState(() => usePaymentOrderStore.getState().product);
  const clear = usePaymentOrderStore((s) => s.clear);

  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [cardId, setCardId] = useState<string | null>(null);
  const [easyPayId, setEasyPayId] = useState<EasyPayProvider | null>(null);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [viewingTermId, setViewingTermId] = useState<
    PaymentTermsSection["id"] | null
  >(null);

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

  const handleSubmit = () => {
    if (!isPayable) return;

    let methodLabel: string;
    if (method === "CARD") {
      methodLabel = `카드 결제(${selectedCardName ?? ""}카드)`;
    } else if (method === "EASY_PAY") {
      const easyPayName =
        EASY_PAY_OPTIONS.find((o) => o.id === easyPayId)?.name ?? "";
      methodLabel = `간편결제(${easyPayName})`;
    } else {
      methodLabel = "휴대폰 결제";
    }

    const state: PaymentResultSuccess = {
      status: "success",
      product,
      methodLabel,
    };
    navigate("/mypage/credit/payment/result", { state });
  };

  return (
    <div className="flex flex-col pb-[6.5rem]">
      <div className="-mx-4">
        <PaymentOrdererSection orderer={MOCK_ORDERER} />
        <PaymentProductSection product={product} />

        {/* TODO: 결제수단 플랫폼 분기 필요 — iOS는 Apple IAP, Android·웹은 카드/간편결제/휴대폰(현재 탭). 약관(paymentTerms.constant) 기준. */}
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
            onViewTerm={(termId) =>
              setViewingTermId(termId === "EPAYMENT" ? "epayment" : "privacy")
            }
          />
        </section>
      </div>

      <CardSelectBottomSheet
        open={isCardSheetOpen}
        onClose={() => setIsCardSheetOpen(false)}
        selectedCardId={cardId}
        onSelect={setCardId}
      />

      <PaymentTermsOverlay
        open={viewingTermId !== null}
        initialSectionId={viewingTermId}
        onClose={() => setViewingTermId(null)}
      />

      <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-120 border-t border-neutral-700 bg-neutral-900 px-4 py-5">
        <CTA_Button
          text="결제하기"
          size="xlarge"
          color={isPayable ? "orange" : "black"}
          disabled={!isPayable}
          onClick={handleSubmit}
        />
      </footer>
    </div>
  );
}
