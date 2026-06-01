import { Checkbox } from "@/components/common";
import { PAYMENT_TERMS } from "@/constants/payment/payment.constant";

interface PaymentTermsAgreementProps {
  agreed: boolean;
  onAgreedChange: (next: boolean) => void;
  onViewTerm: (termId: string) => void;
}

export function PaymentTermsAgreement({
  agreed,
  onAgreedChange,
  onViewTerm,
}: PaymentTermsAgreementProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <ul className="flex flex-col gap-[0.3125rem]">
        {PAYMENT_TERMS.map((term) => (
          <li
            key={term.id}
            className="flex items-center justify-between text-[0.8125rem] leading-[1.55] font-normal tracking-[-0.02em] text-neutral-300"
          >
            <span className="break-keep">{term.label}</span>
            <button
              type="button"
              onClick={() => onViewTerm(term.id)}
              className="shrink-0 underline"
            >
              보기
            </button>
          </li>
        ))}
      </ul>

      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-neutral-0 text-[0.9375rem] leading-[1.55] font-normal tracking-[-0.02em] break-keep">
          위 내용을 확인하였으며 결제에 동의합니다.
        </span>
        <Checkbox checked={agreed} onChange={onAgreedChange} />
      </label>
    </div>
  );
}
