import { Press } from "@/components/common";
import type { PaymentMethod } from "@/types/payment";

interface PaymentMethodTabsProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const TABS: { id: PaymentMethod; label: string }[] = [
  { id: "CARD", label: "신용카드" },
  { id: "EASY_PAY", label: "간편결제" },
  { id: "PHONE", label: "휴대폰" },
];

export function PaymentMethodTabs({ value, onChange }: PaymentMethodTabsProps) {
  return (
    <div className="flex items-center gap-[0.8125rem]">
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <Press
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-pressed={active}
            className={`ease-smooth-out flex h-[3.25rem] flex-1 items-center justify-center rounded-[0.75rem] px-4 py-[0.625rem] text-[0.875rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100 transition-colors duration-[var(--duration-quick)] motion-reduce:transition-none ${
              active
                ? "border-[1.5px] border-orange-500"
                : "border border-neutral-800"
            }`}
          >
            {tab.label}
          </Press>
        );
      })}
    </div>
  );
}
