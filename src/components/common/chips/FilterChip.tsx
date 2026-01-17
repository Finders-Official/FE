interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function FilterChip({
  label,
  selected = false,
  onClick,
  className = "",
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[2.5rem] shrink-0 items-center justify-center rounded-[3.125rem] border px-[0.75rem] py-[0.625rem] text-[0.8125rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-nowrap transition-colors ${
        selected
          ? "border-orange-500 bg-orange-500/16 text-orange-500"
          : "border-neutral-400 text-neutral-200"
      } ${className}`}
    >
      {label}
    </button>
  );
}

export type { FilterChipProps };
