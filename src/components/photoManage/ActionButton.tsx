import React from "react";
import { ChevronLeftIcon } from "@/assets/icon";

interface ActionButtonProps {
  leftIcon: React.ReactNode;
  message: string;
  showNext: boolean;
  onClick: () => void;
  className?: string;
}

export const ActionButton = ({
  leftIcon,
  message,
  showNext,
  onClick,
  className = "",
}: ActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[2.9375rem] w-[17.3125rem] items-center justify-between rounded-[1.125rem] border border-orange-400 bg-orange-400/16 px-[1rem] py-[0.75rem] text-[0.875rem] leading-[150%] font-semibold tracking-[-0.023em] text-orange-400 transition-colors ${className}`}
    >
      {/* 좌측 아이콘 영역 */}
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-[#EC602D]">
        {leftIcon}
      </div>

      {/* 텍스트 영역 */}
      <span className="w-[11.4375rem] text-start text-[0.875rem] leading-[155%] tracking-[-0.02em] whitespace-pre-wrap text-[#EC602D]">
        {message}
      </span>

      {/* 우측 Next 아이콘 영역 */}
      {showNext && (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-neutral-400">
          <ChevronLeftIcon className="h-6 w-6 -scale-x-100 text-[#EC602D]" />
        </div>
      )}
    </button>
  );
};
