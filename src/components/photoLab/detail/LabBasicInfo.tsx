import { useState } from "react";
import type { PhotoLabDetail } from "@/types/photoLab";
import {
  StarIcon,
  StarFillIcon,
  BriefcaseIcon,
  ClockIcon,
} from "@/assets/icon";
import TagBadge from "../TagBadge";

interface LabBasicInfoProps {
  lab: PhotoLabDetail;
  onFavoriteToggle?: (photoLabId: number) => void;
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
    setIsFavorite((prev) => !prev);
    onFavoriteToggle?.(lab.photoLabId);
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 px-4 py-[1.875rem]">
        {/* 이름 + 즐겨찾기 */}
        <div className="flex items-center justify-between">
          <h2 className="text-[1.375rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            {lab.name}
          </h2>
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
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                {lab.address}
              </span>
              <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
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
                  <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                    총 작업 건 수
                  </span>
                </div>
                <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
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
                    <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                      작업 소요 시간
                    </span>
                  </div>
                  <span className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-200">
                    {lab.avgWorkTimeMinutes}분
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="-mx-4 h-px bg-neutral-800" />
    </div>
  );
}
