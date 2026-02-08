import React from "react";
import { TooltipXIcon } from "@/assets/icon";

interface TooltipProps {
  used: number;
  total: number;
  onClose: () => void;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  used,
  total,
  onClose,
  className = "",
}) => {
  return (
    <div
      className={
        "pointer-events-auto relative flex h-11 w-40.25 items-center rounded-[0.625rem] " +
        "bg-[#E94E16] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] " +
        className
      }
      role="status"
      aria-live="polite"
    >
      {/* 본문: 한 줄 고정 + 양끝 정렬 */}
      <div className="font-regular flex h-full w-full items-center justify-between gap-2 px-4 text-[13px] whitespace-nowrap">
        <span>
          무료 크레딧 {used}/{total} 사용
        </span>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full"
          aria-label="툴팁 닫기"
        >
          <TooltipXIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 꼬리: 8x6 중앙 */}
      <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-t-[6px] border-r-4 border-l-4 border-t-orange-500 border-r-transparent border-l-transparent" />
    </div>
  );
};
