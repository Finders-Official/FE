import React from "react";
import { TooltipXIcon } from "@/assets/icon";
import { Press } from "@/components/common/motion";

interface TooltipProps {
  balance: number;
  onClose: () => void;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ balance, onClose }) => {
  return (
    <div
      className={
        "pointer-events-auto relative flex h-11 w-fit items-center rounded-[0.625rem] bg-orange-500 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      }
      role="status"
      aria-live="polite"
    >
      {/* 본문: 한 줄 고정 + 양끝 정렬 */}
      <div className="font-regular flex h-full w-full items-center justify-between gap-2 px-4 text-[13px] whitespace-nowrap">
        <span>사용 가능한 크레딧 {balance}개</span>

        <Press
          type="button"
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full"
          aria-label="툴팁 닫기"
        >
          <TooltipXIcon className="h-4 w-4" />
        </Press>
      </div>

      {/* 꼬리: 8x6 중앙 */}
      <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-t-[6px] border-r-4 border-l-4 border-t-orange-500 border-r-transparent border-l-transparent" />
    </div>
  );
};
