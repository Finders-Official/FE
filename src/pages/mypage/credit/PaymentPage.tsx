import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { CTA_Button } from "@/components/common";
import {
  PaymentOrdererSection,
  PaymentProductSection,
  PaymentSummary,
} from "@/components/payment";
import { MOCK_ORDERER } from "@/constants/payment/payment.mock";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";

export function PaymentPage() {
  const [product] = useState(() => usePaymentOrderStore.getState().product);
  const clear = usePaymentOrderStore((s) => s.clear);

  useEffect(() => {
    if (product) clear();
  }, [product, clear]);

  if (!product) {
    return <Navigate to="/mypage/credit" replace />;
  }

  return (
    <div className="flex flex-col pb-[6.5rem]">
      <div className="-mx-4">
        <PaymentOrdererSection orderer={MOCK_ORDERER} />
        <PaymentProductSection product={product} />
        <PaymentSummary
          productPrice={product.price}
          totalPrice={product.price}
        />
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-120 border-t border-neutral-700 bg-neutral-900 px-4 py-5">
        <CTA_Button text="결제하기" size="xlarge" color="black" disabled />
      </footer>
    </div>
  );
}
