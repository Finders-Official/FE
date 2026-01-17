interface TagBadgeProps {
  label: string;
  className?: string;
}

export default function TagBadge({ label, className = "" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[0.1875rem] bg-orange-500/40 px-1 py-[0.1875rem] text-[0.625rem] leading-[126%] font-semibold tracking-[-0.02em] text-orange-200 ${className}`}
    >
      {label}
    </span>
  );
}

export type { TagBadgeProps };
