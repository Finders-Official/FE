import { useState } from "react";
import type { PhotoLabDetail } from "@/types/photoLab";
import { StarIcon, StarFillIcon } from "@/assets/icon";
import { Press, IconSwap } from "@/components/common";

interface LabBasicInfoProps {
  lab: PhotoLabDetail;
  onFavoriteToggle?: (photoLabId: string, isFavorite: boolean) => void;
  className?: string;
}

export default function LabBasicInfo({
  lab,
  onFavoriteToggle,
  className = "",
}: LabBasicInfoProps) {
  const [prevFavorite, setPrevFavorite] = useState(lab.isFavorite);
  const [isFavorite, setIsFavorite] = useState(lab.isFavorite);

  if (lab.isFavorite !== prevFavorite) {
    setPrevFavorite(lab.isFavorite);
    setIsFavorite(lab.isFavorite);
  }

  const handleFavoriteClick = () => {
    const currentState = isFavorite;
    setIsFavorite((prev) => !prev);
    onFavoriteToggle?.(lab.photoLabId, currentState);
  };

  return (
    <div className={className}>
      <div className="flex justify-between py-7.5">
        {/* 현상소 이름 및 위치정보 */}
        <div className="flex flex-col gap-1.5">
          <h2 className="min-w-0 flex-1 truncate text-[1.375rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            {lab.name}
          </h2>
          <div className="flex gap-1 px-1">
            <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
              {lab.address}
            </span>
            {lab.distanceKm != null && (
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                ({lab.distanceKm.toFixed(1)}km)
              </span>
            )}
          </div>
        </div>

        {/* 즐겨찾기 */}
        <div className="flex flex-col items-center gap-0.5">
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
      <div className="-mx-4 h-px bg-neutral-800" />
    </div>
  );
}
