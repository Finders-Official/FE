import { LogoIcon, XMarkIcon } from "@/assets/icon";

export type SearchPostProps = {
  historyId: number;
  image?: string;
  text: string;
  onClick?: () => void;
  onDelete?: (historyId: number) => void;
  className?: string;
};

export default function SearchPost({
  historyId,
  image,
  text,
  onClick,
  onDelete,
  className = "",
}: SearchPostProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(historyId);
  };

  return (
    <div
      className={`flex items-center justify-between ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* 사진 + 텍스트 */}
      <div className="flex items-center gap-[18px]">
        {image ? (
          <img
            src={image}
            alt={text}
            className="h-21 w-21 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-21 w-21 items-center justify-center rounded-2xl">
            <LogoIcon className="h-8 w-8" />
          </div>
        )}
        <span className="text-4 leading-[155%] tracking-[-0.02em] text-neutral-200">
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
