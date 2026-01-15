import { useState } from "react";
import type { PhotoLabItem } from "@/types/photoLab";
import {
  StarIcon,
  StarFillIcon,
  BriefcaseIcon,
  ClockIcon,
} from "@/assets/icon";
import TagBadge from "./TagBadge";

interface LabCardProps {
  lab: PhotoLabItem;
  onFavoriteToggle?: (photoLabId: number) => void;
  onCardClick?: (photoLabId: number) => void;
  className?: string;
}

export default function LabCard({
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
    onFavoriteToggle?.(lab.photoLabId);
  };

  const handleCardClick = () => {
    onCardClick?.(lab.photoLabId);
  };

  return (
    <div
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className={`flex flex-col p-4 ${onCardClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="flex flex-col gap-3.5 border-b border-neutral-800 pb-5">
        <div className="flex flex-col gap-2">
          {/* 이름 + 즐겨찾기 */}
          <div className="flex items-center justify-between">
            <h3 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
              {lab.name}
            </h3>
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
          </div>

          {/* 상세 정보 */}
          <div className="flex flex-col gap-1.5">
            {/* 태그 */}
            {lab.keywords.length > 0 && (
              <div className="flex items-center gap-1 px-1">
                {lab.keywords.map((keyword) => (
                  <TagBadge key={keyword} label={keyword} />
                ))}
              </div>
            )}

            {/* 주소 및 통계 */}
            <div className="flex flex-col gap-1">
              {/* 주소 + 거리 */}
              <div className="flex items-center gap-1 px-1">
                <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                  {lab.address}
                </span>
                <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                  ({lab.distanceKm}km)
                </span>
              </div>

              {/* 작업 건수 + 소요시간 */}
              <div className="flex items-center gap-2">
                {/* 작업 건수 */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <BriefcaseIcon className="h-3 w-3 text-neutral-300" />
                    </div>
                    <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                      총 작업 건 수
                    </span>
                  </div>
                  <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                    {lab.workCount}건
                  </span>
                </div>

                {/* 소요시간 */}
                {lab.avgWorkTimeMinutes !== null && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <ClockIcon className="h-3 w-3 text-neutral-300" />
                      </div>
                      <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                        작업 소요 시간
                      </span>
                    </div>
                    <span className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                      {lab.avgWorkTimeMinutes}분
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Section - 오른쪽 패딩 밖으로 확장해서 다음 이미지 살짝 보이게, 혹은 추후에 화면 끝까지 */}
        {lab.imageUrls.length > 0 && (
          <div className="scrollbar-hide -mr-4 flex gap-2 overflow-x-auto pr-4">
            {lab.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${lab.name} 이미지 ${index + 1}`}
                className="h-[8.875rem] w-[14.5rem] shrink-0 rounded-[0.625rem] object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type { LabCardProps };
