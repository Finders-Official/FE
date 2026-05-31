import { PAYMENT_REFUND_NOTICES } from "@/constants/payment/payment.constant";

export function PaymentRefundNotice() {
  return (
    <ul className="list-disc pl-[1.125rem] text-[0.75rem] leading-[1.26] font-normal tracking-[-0.02em] text-neutral-500">
      {PAYMENT_REFUND_NOTICES.map((line) => (
        <li key={line} className="break-keep">
          {line}
        </li>
      ))}
    </ul>
  );
}
