import { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import { ALL_FINANCIAL_INSTITUTIONS } from "@/constants/photomanage/banks.constant";
import type { BankInfo } from "@/types/photomanage/transaction";

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

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
        {/* 트리거 버튼 */}
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
            className={`h-6 w-6 text-neutral-200 transition-transform ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen && (
          <ul className="border-neutral-850 absolute z-10 mt-2 max-h-[15rem] w-full overflow-y-auto rounded-[0.625rem] border bg-neutral-900">
            {ALL_FINANCIAL_INSTITUTIONS.map((bank) => {
              const selected = value?.code === bank.code;
              return (
                <li key={bank.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(bank)}
                    className={`w-full px-4 py-3 text-left text-[0.9375rem] leading-[1.55] tracking-[-0.01875rem] ${
                      selected
                        ? "bg-neutral-850 text-neutral-100"
                        : "text-neutral-100"
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
