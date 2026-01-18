interface PopularLabItemProps {
  rank: number;
  name: string;
  onClick?: () => void;
}

export default function PopularLabItem({
  rank,
  name,
  onClick,
}: PopularLabItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 w-full items-center gap-4"
    >
      <span className="text-[0.875rem] leading-6 font-semibold text-orange-500">
        {rank}
      </span>
      <span className="flex-1 truncate text-left text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-300">
        {name}
      </span>
    </button>
  );
}
