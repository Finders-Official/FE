import { ClockIcon, XMarkIcon, MagnifyingGlassIcon } from "@/assets/icon";

type SearchItemType = "recent" | "search";

interface SearchItemProps {
  type: SearchItemType;
  text: string;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function SearchItem({
  type,
  text,
  onClick,
  onDelete,
  className = "",
}: SearchItemProps) {
  const IconComponent = type === "recent" ? ClockIcon : MagnifyingGlassIcon;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={`flex items-center justify-between ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* 아이콘 + 텍스트 */}
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800">
          <IconComponent className="h-3.75 w-3.75 text-neutral-400" />
        </span>
        <span className="text-base leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
          {text}
        </span>
      </div>

      {/* X 버튼 */}
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="flex h-6 w-6 items-center justify-center"
        >
          <XMarkIcon className="h-3 w-3 text-neutral-400" />
        </button>
      )}
    </div>
  );
}

export type { SearchItemProps, SearchItemType };
