import type { ReactNode } from "react";
import { CopyButton } from "@/components/common";

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
    <div className="flex flex-col gap-[0.25rem] text-[0.8125rem]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-[0.5rem]">
          <span className="text-neutral-400">{item.label}</span>
          {item.copyValue && (
            <CopyButton
              text={item.copyValue}
              toastMessage="송장번호가 클립보드에 복사되었습니다."
              className="text-neutral-400 hover:text-white"
              iconClassName="h-3.5 w-3.5"
              aboveTabBar
            />
          )}
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
