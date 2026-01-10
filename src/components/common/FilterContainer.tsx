import { ChevronLeftIcon } from "@/assets/icon";
import Icon from "./Icon";

interface FilterContainerProps {
  label: string;
  value?: string;
  onClick: () => void;
  className?: string;
}

export default function FilterContainer({
  label,
  value,
  onClick,
  className = "",
}: FilterContainerProps) {
  const displayText = value || label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[1.5625rem] w-full items-center justify-between ${className}`}
    >
      <span className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
        {displayText}
      </span>
      <Icon className="-rotate-90 text-neutral-200">
        <ChevronLeftIcon />
      </Icon>
    </button>
  );
}

export type { FilterContainerProps };
