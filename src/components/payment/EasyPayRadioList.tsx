import { CircleFillIcon, EmptyCircleIcon } from "@/assets/icon";
import { EASY_PAY_OPTIONS } from "@/constants/payment/payment.constant";
import type { EasyPayProvider } from "@/types/payment";

interface EasyPayRadioListProps {
  value: EasyPayProvider | null;
  onChange: (provider: EasyPayProvider) => void;
}

export function EasyPayRadioList({ value, onChange }: EasyPayRadioListProps) {
  return (
    <ul role="radiogroup" className="flex flex-col gap-2">
      {EASY_PAY_OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <li key={option.id}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className="text-neutral-0 flex items-center gap-[1.1875rem] text-[0.9375rem] leading-[1.55] font-normal tracking-[-0.02em]"
            >
              {selected ? (
                <CircleFillIcon className="h-[1.1875rem] w-[1.1875rem] text-orange-500" />
              ) : (
                <EmptyCircleIcon className="h-[1.1875rem] w-[1.1875rem] text-neutral-500" />
              )}
              <span>{option.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
