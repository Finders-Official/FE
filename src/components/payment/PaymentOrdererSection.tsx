import type { OrdererInfo } from "@/types/payment";
import { PaymentSection } from "./PaymentSection";

interface PaymentOrdererSectionProps {
  orderer: OrdererInfo;
}

export function PaymentOrdererSection({ orderer }: PaymentOrdererSectionProps) {
  return (
    <PaymentSection title="주문자 정보">
      <dl className="flex flex-col gap-[0.125rem] text-[0.875rem] leading-[1.55] font-normal tracking-[-0.02em] text-neutral-200">
        <Row label="주문자" value={orderer.name} />
        <Row label="전화번호" value={orderer.phoneNumber} />
      </dl>
    </PaymentSection>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-8">
      <dt className="w-16 shrink-0">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
