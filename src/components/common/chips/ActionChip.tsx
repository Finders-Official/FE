import { ChevronLeftIcon } from "@/assets/icon";
import Icon from "../Icon";

interface ActionChipProps {
  label: string;
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ActionChip({
  label,
  showArrow = true,
  onClick,
  className = "",
}: ActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[3rem] items-center justify-center gap-[0.25rem] rounded-[3.125rem] border border-orange-400 bg-orange-400/16 px-[1rem] py-[0.75rem] text-[0.875rem] leading-[150%] font-semibold tracking-[-0.023em] text-orange-400 transition-colors ${className}`}
    >
      {label}
      {showArrow && (
        <Icon className="rotate-180 text-orange-400">
          <ChevronLeftIcon />
        </Icon>
      )}
    </button>
  );
}

export type { ActionChipProps };
