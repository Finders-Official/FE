import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import { ALL_FINANCIAL_INSTITUTIONS } from "@/constants/photomanage/banks.constant";
import type { BankInfo } from "@/types/photomanage/transaction";
import { useReveal, useDismiss } from "@/transitions";

interface BankSelectDropdownProps {
  value: BankInfo | null;
  onChange: (bank: BankInfo) => void;
}

export function BankSelectDropdown({
  value,
  onChange,
}: BankSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mounted, getRevealProps } = useReveal<HTMLUListElement>(isOpen, {
    variant: "dropdown",
  });
  useDismiss(containerRef, () => setIsOpen(false), isOpen);

  const handleSelect = (bank: BankInfo) => {
    onChange(bank);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02rem] text-neutral-100">
        은행
      </label>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-neutral-850 flex w-full items-center justify-between rounded-[0.625rem] border px-4 py-[0.875rem]"
        >
          <span
            className={`text-[0.9375rem] leading-[1.55] tracking-[-0.01875rem] ${
              value ? "text-neutral-100" : "text-neutral-600"
            }`}
          >
            {value?.name || "입금하실 은행을 선택해주세요"}
          </span>
          <ChevronLeftIcon
            className={`ease-smooth-out h-6 w-6 text-neutral-200 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>

        {mounted && (
          <ul
            {...getRevealProps({
              className:
                "border-neutral-850 absolute z-10 mt-2 max-h-[15rem] w-full overflow-y-auto rounded-[0.625rem] border bg-neutral-900",
            })}
            style={{ "--reveal-origin": "top center" } as CSSProperties}
          >
            {ALL_FINANCIAL_INSTITUTIONS.map((bank) => {
              const selected = value?.code === bank.code;
              return (
                <li key={bank.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(bank)}
                    className={`w-full px-4 py-3 text-left text-[0.9375rem] leading-[1.55] tracking-[-0.01875rem] text-neutral-100 ${
                      selected ? "bg-neutral-850" : ""
                    }`}
                  >
                    {bank.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
