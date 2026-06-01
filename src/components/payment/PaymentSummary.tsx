import { PaymentSection } from "./PaymentSection";

interface PaymentSummaryProps {
  productPrice: number;
  totalPrice: number;
}

const formatWon = (price: number) => `${price.toLocaleString("ko-KR")} 원`;

export function PaymentSummary({
  productPrice,
  totalPrice,
}: PaymentSummaryProps) {
  return (
    <PaymentSection title="결제 금액">
      <div className="flex flex-col">
        <div className="flex items-center justify-between text-[0.875rem] leading-[1.55] font-normal tracking-[-0.02em] text-neutral-200">
          <span>상품금액</span>
          <span>{formatWon(productPrice)}</span>
        </div>
        <div className="text-neutral-0 border-neutral-850 mt-3 flex items-center justify-between border-t py-3 text-[0.9375rem] leading-[1.55] font-semibold tracking-[-0.02em]">
          <span>최종 결제금액</span>
          <span>{formatWon(totalPrice)}</span>
        </div>
      </div>
    </PaymentSection>
  );
}
