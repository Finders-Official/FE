import { ClockIcon, XMarkIcon, MagnifyingGlassIcon } from "@/assets/icon";

type SearchItemType = "recent" | "search";

interface SearchItemProps {
  type: SearchItemType;
  text: string;
  highlightText?: string;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function SearchItem({
  type,
  text,
  highlightText,
  onClick,
  onDelete,
  className = "",
}: SearchItemProps) {
  const IconComponent = type === "recent" ? ClockIcon : MagnifyingGlassIcon;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const renderHighlightedText = () => {
    if (!highlightText) return text;

    const lowerText = text.toLowerCase();
    const lowerHighlight = highlightText.toLowerCase();
    const index = lowerText.indexOf(lowerHighlight);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + highlightText.length);
    const after = text.slice(index + highlightText.length);

    return (
      <>
        {before}
        <span className="font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div
      className={`flex items-center justify-between ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* 아이콘 + 텍스트 */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800">
          <IconComponent className="h-3.75 w-3.75 text-neutral-400" />
        </span>
        <span className="min-w-0 flex-1 truncate text-base leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
          {renderHighlightedText()}
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
