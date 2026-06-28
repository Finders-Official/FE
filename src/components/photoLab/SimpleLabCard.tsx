import { useState } from "react";
import type { SimplePhotoLabItem } from "@/types/photoLab";
import { StarIcon, StarFillIcon } from "@/assets/icon";
import { photoLabPlaceholder } from "@/assets/images";
import { Press, IconSwap } from "@/components/common";

interface LabCardProps {
  lab: SimplePhotoLabItem;
  onFavoriteToggle?: (photoLabId: string, isFavorite: boolean) => void;
  onCardClick?: (photoLabId: string) => void;
  className?: string;
}

export default function SimpleLabCard({
  lab,
  onFavoriteToggle,
  onCardClick,
  className = "",
}: LabCardProps) {
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
    onFavoriteToggle?.(lab.photoLabId, isFavorite);
  };

  const handleCardClick = () => {
    onCardClick?.(lab.photoLabId);
  };

  return (
    <div
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (onCardClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`flex flex-col py-4 first:pt-0 ${onCardClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="flex gap-3.5 border-b-[0.5px] border-neutral-800 pb-5">
        {/* 썸네일 */}
        <img
          src={lab.imageUrls?.[0] || photoLabPlaceholder}
          alt={`${lab.name} 이미지`}
          loading="lazy"
          className="h-15 w-15 shrink-0 rounded-[0.625rem] object-cover"
        />
        {/* 카드 상세 정보 */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-[1.06rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
              {lab.name}
            </h3>

            {/* 주소 + 거리 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-[0.75rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                  {lab.address}
                </span>
                {lab.distanceKm != null && (
                  <span className="text-[0.75rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                    ({lab.distanceKm.toFixed(1)}km)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 즐겨찾기 */}
          <div className="flex flex-col items-center justify-center gap-1">
            <Press
              type="button"
              onClick={handleFavoriteClick}
              className="flex h-6 w-6 shrink-0 items-center justify-center"
              aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              aria-pressed={isFavorite}
            >
              <IconSwap
                active={isFavorite}
                bounce
                className="h-6 w-6 place-items-center"
                iconA={
                  <StarIcon className="h-[1.125rem] w-[1.125rem] text-neutral-300" />
                }
                iconB={<StarFillIcon className="h-6 w-6" />}
              />
            </Press>
            <p className="text-[0.625rem] leading-[128%] font-thin tracking-[-0.02em] text-neutral-400">
              {lab.favoriteCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { LabCardProps };
