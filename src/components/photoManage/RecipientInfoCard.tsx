import type { ReactNode } from "react";
import { CopyButton } from "@/components/common";
import React from "react";

interface InfoItem {
  label: string;
  value: ReactNode;
  copyValue?: string;
}

interface RecipientInfoCardProps {
  items: InfoItem[];
}

export function RecipientInfoCard({ items }: RecipientInfoCardProps) {
  return (
    <div className="mt-[13px] grid grid-cols-[3.75rem_1fr] gap-x-4 gap-y-1.5 text-[0.8125rem]">
      {items.map((item) => (
        <React.Fragment key={item.label}>
          {/* 라벨 셀 */}
          <div className="text-left text-neutral-400">{item.label}</div>

          {/* 값 셀 */}
          <div className="flex items-start gap-2 text-left break-words text-white">
            {item.copyValue && (
              <CopyButton
                text={item.copyValue}
                toastMessage="송장번호가 클립보드에 복사되었습니다."
                className="text-neutral-400 hover:text-white"
                iconClassName="h-3.5 w-3.5"
                aboveTabBar
              />
            )}
            <div className="min-w-0">{item.value}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
