import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { CTA_Button } from "@/components/common";
import {
  CardSelectBottomSheet,
  CardSelectButton,
  PaymentMethodTabs,
  PaymentOrdererSection,
  PaymentProductSection,
  PaymentSection,
  PaymentSummary,
} from "@/components/payment";
import { CREDIT_CARD_OPTIONS } from "@/constants/payment/payment.constant";
import { MOCK_ORDERER } from "@/constants/payment/payment.mock";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";
import type { PaymentMethod } from "@/types/payment";

export function PaymentPage() {
  const [product] = useState(() => usePaymentOrderStore.getState().product);
  const clear = usePaymentOrderStore((s) => s.clear);

  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [cardId, setCardId] = useState<string | null>(null);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);

  useEffect(() => {
    if (product) clear();
  }, [product, clear]);

  const selectedCardName = useMemo(
    () => CREDIT_CARD_OPTIONS.find((c) => c.id === cardId)?.name ?? null,
    [cardId],
  );

  if (!product) {
    return <Navigate to="/mypage/credit" replace />;
  }

  return (
    <div className="flex flex-col pb-[6.5rem]">
      <div className="-mx-4">
        <PaymentOrdererSection orderer={MOCK_ORDERER} />
        <PaymentProductSection product={product} />

        <PaymentSection title="결제 수단">
          <div className="flex flex-col gap-2">
            <PaymentMethodTabs value={method} onChange={setMethod} />
            {method === "CARD" && (
              <CardSelectButton
                selectedName={selectedCardName}
                onClick={() => setIsCardSheetOpen(true)}
              />
            )}
          </div>
        </PaymentSection>

        <PaymentSummary
          productPrice={product.price}
          totalPrice={product.price}
        />
      </div>

      <CardSelectBottomSheet
        open={isCardSheetOpen}
        onClose={() => setIsCardSheetOpen(false)}
        selectedCardId={cardId}
        onSelect={setCardId}
      />

      <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-120 border-t border-neutral-700 bg-neutral-900 px-4 py-5">
        <CTA_Button text="결제하기" size="xlarge" color="black" disabled />
      </footer>
    </div>
  );
}
