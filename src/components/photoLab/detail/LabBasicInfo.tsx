import type { PhotoLabDetail } from "@/types/photoLab";
import { FavoriteStar } from "../FavoriteStar";

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
        <FavoriteStar
          photoLabId={lab.photoLabId}
          isFavorite={lab.isFavorite}
          favoriteCount={lab.favoriteCount}
          onToggle={onFavoriteToggle}
          className="gap-0.5"
        />
      </div>
      <div className="-mx-4 h-px bg-neutral-800" />
    </div>
  );
}
