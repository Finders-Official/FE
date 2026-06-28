import { Press } from "@/components/common/motion";

interface TimeFilterChipProps {
  time: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TimeFilterChip({
  time,
  selected = false,
  onClick,
  className = "",
}: TimeFilterChipProps) {
  return (
    <Press
      type="button"
      onClick={onClick}
      className={`flex h-[2.375rem] shrink-0 items-center justify-center rounded-[3.125rem] border px-[0.625rem] py-[0.5rem] text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] whitespace-nowrap ${
        selected
          ? "border-orange-500 bg-orange-500 text-white"
          : "border-neutral-700 text-white"
      } ${className}`}
    >
      {time}
    </Press>
  );
}

export type { TimeFilterChipProps };
