interface DateChipProps {
  day: number | string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function DateChip({
  day,
  label,
  selected = false,
  disabled = false,
  onClick,
  className = "",
}: DateChipProps) {
  const getTextColor = () => {
    if (selected) return "text-neutral-100";
    if (disabled) return "text-neutral-700";
    return "text-neutral-100";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[3rem] w-[3rem] flex-col items-center justify-center rounded-[0.625rem] px-[0.875rem] py-[0.375rem] transition-colors ${
        selected ? "bg-orange-500" : ""
      } ${disabled ? "cursor-not-allowed" : ""} ${className}`}
    >
      <span
        className={`text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] ${getTextColor()}`}
      >
        {day}
      </span>
      {label && (
        <span
          className={`text-[0.625rem] leading-[126%] font-normal tracking-[-0.02em] ${getTextColor()}`}
        >
          {label}
        </span>
      )}
    </button>
  );
}

export type { DateChipProps };
