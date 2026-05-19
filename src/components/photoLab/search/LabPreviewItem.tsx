import { StarFillIcon, StarIcon } from "@/assets/icon";
import type { LabPreview } from "@/types/photoLabSearch";
import { useState } from "react";

interface LabPreviewItemProps {
  lab: LabPreview;
  onClick?: () => void;
  onFavoriteToggle?: (photoLabId: number, isFavorite: boolean) => void;
}

export default function LabPreviewItem({
  lab,
  onClick,
  onFavoriteToggle,
}: LabPreviewItemProps) {
  // Optimistic
  const [prevFavorite, setPrevFavorite] = useState(lab.isFavorite);
  const [isFavorite, setIsFavorite] = useState(lab.isFavorite);

  if (lab.isFavorite !== prevFavorite) {
    setPrevFavorite(lab.isFavorite);
    setIsFavorite(lab.isFavorite);
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    onFavoriteToggle?.(lab.photoLabId, lab.isFavorite);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="flex w-full cursor-pointer items-center gap-3.5 py-[1rem] first:pt-0"
    >
      {/* 이미지 */}
      {lab.imageUrl ? (
        <img
          src={lab.imageUrl}
          alt={lab.name}
          className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-[0.375rem] object-cover"
        />
      ) : (
        <div className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-[0.375rem] bg-neutral-800" />
      )}

      {/* 텍스트 */}
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <span className="truncate text-left text-[1.06rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
          {lab.name}
        </span>
        <span className="truncate text-left text-[0.75rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-300">
          {lab.address}
        </span>
      </div>

      {/* 즐겨찾기 */}
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="flex h-6 w-6 shrink-0 items-center justify-center"
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          {isFavorite ? (
            <StarFillIcon className="h-6 w-6" />
          ) : (
            <StarIcon className="h-[1.125rem] w-[1.125rem] text-neutral-300" />
          )}
        </button>
        <p className="text-[0.625rem] leading-[128%] font-thin tracking-[-0.02em] text-neutral-400">
          {lab.favoriteCount}
        </p>
      </div>
    </div>
  );
}
