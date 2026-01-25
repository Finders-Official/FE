interface TimeSlotChipProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TimeSlotChip({
  time,
  selected = false,
  disabled = false,
  onClick,
  className = "",
}: TimeSlotChipProps) {
  const getStyles = () => {
    if (selected) {
      return "bg-orange-500 text-neutral-100";
    }
    if (disabled) {
      return "border border-neutral-800 text-neutral-700 cursor-not-allowed";
    }
    return "border border-neutral-800 text-neutral-200";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[3rem] w-full items-center justify-center rounded-[0.625rem] px-[1.25rem] py-[0.625rem] text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] transition-colors ${getStyles()} ${className}`}
    >
      {time}
    </button>
  );
}

export type { TimeSlotChipProps };
