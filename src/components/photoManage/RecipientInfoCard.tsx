import type { ReactNode } from "react";
import { CopyIcon } from "@/assets/icon";

interface InfoItem {
  label: string;
  value: ReactNode;
  copyValue?: string;
}

interface RecipientInfoCardProps {
  items: InfoItem[];
}

export function RecipientInfoCard({ items }: RecipientInfoCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-[0.25rem] text-[0.8125rem]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-[0.5rem]">
          <span className="text-neutral-400">{item.label}</span>
          {item.copyValue && (
            <button
              type="button"
              onClick={() => handleCopy(item.copyValue!)}
              className="text-neutral-400 hover:text-white"
            >
              <CopyIcon className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
