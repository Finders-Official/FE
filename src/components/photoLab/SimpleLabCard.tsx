import { memo } from "react";
import type { SimplePhotoLabItem } from "@/types/photoLab";
import { photoLabPlaceholder } from "@/assets/images";
import { FavoriteStar } from "./FavoriteStar";
import { Press } from "@/components/common/motion";

interface LabCardProps {
  lab: SimplePhotoLabItem;
  onFavoriteToggle?: (photoLabId: string, isFavorite: boolean) => void;
  onCardClick?: (photoLabId: string) => void;
  className?: string;
  // FLIP 재정렬용 고정 식별자 (useFlipReorder)
  flipKey?: string;
}

function SimpleLabCard({
  lab,
  onFavoriteToggle,
  onCardClick,
  className = "",
  flipKey,
}: LabCardProps) {
  const handleCardClick = () => {
    onCardClick?.(lab.photoLabId);
  };

  return (
    <Press
      as="div"
      data-flip-key={flipKey}
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
          <FavoriteStar
            photoLabId={lab.photoLabId}
            isFavorite={lab.isFavorite}
            favoriteCount={lab.favoriteCount}
            onToggle={onFavoriteToggle}
            className="justify-center gap-1"
          />
        </div>
      </div>
    </Press>
  );
}

// memo로 토글된 카드 1장만 리렌더
export default memo(SimpleLabCard);

export type { LabCardProps };
