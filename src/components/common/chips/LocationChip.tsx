import { Press } from "@/components/common/motion";

interface LocationChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function LocationChip({
  label,
  count,
  selected = false,
  onClick,
  className = "",
}: LocationChipProps) {
  return (
    <Press
      type="button"
      onClick={onClick}
      className={`flex h-[2.25rem] items-center justify-center gap-[0.125rem] rounded-[3.125rem] border px-[0.75rem] py-[0.5rem] ${
        selected
          ? "border-orange-400 bg-orange-400/16 text-orange-400"
          : "border-neutral-400 text-neutral-200"
      } ${className}`}
    >
      <span className="text-[0.8125rem] leading-[155%] font-semibold tracking-[-0.02em]">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[0.75rem] leading-[126%] font-normal tracking-[-0.02em]">
          ({count})
        </span>
      )}
    </Press>
  );
}

export type { LocationChipProps };
