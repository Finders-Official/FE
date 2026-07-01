import { StarIcon } from "@/assets/icon";
import { photoLabPlaceholder } from "@/assets/images";
import type { PhotoLab } from "@/types/mypage/photolab";
import { Link } from "react-router";
import { Press, IconSwap, NumberPopIn } from "@/components/common";
import { useOptimisticFavorite } from "@/hooks/photoLab";

type Props = {
  photoLab: PhotoLab;
  onToggleLike?: (id: string, isFavorite: boolean) => void; // 서버 토글(현재값 기준)
};

export const PhotoLabCard = ({ photoLab, onToggleLike }: Props) => {
  const { isFavorite, favoriteCount, toggle } = useOptimisticFavorite({
    isFavorite: photoLab.isFavorite,
    favoriteCount: photoLab.favoriteCount,
    onToggle: (current) => onToggleLike?.(photoLab.id, current),
  });

  return (
    <div className="mt-2 border-b border-neutral-800 py-4">
      <div className="group relative">
        {/*즐겨찾기 버튼: 클릭 시 링크 이동 방지 + UI 즉시 토글 */}
        <Press
          type="button"
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
          aria-pressed={isFavorite}
          className="absolute top-3 right-1 z-10 flex inline-flex h-10 w-10 flex-col items-center justify-center rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
        >
          <IconSwap
            active={isFavorite}
            bounce
            className="h-5 w-5"
            iconA={<StarIcon className="h-5 w-5 fill-none text-white" />}
            iconB={
              <StarIcon className="h-5 w-5 fill-orange-500 text-orange-500" />
            }
          />
          <p className="text-[0.725rem] text-neutral-400">
            <NumberPopIn
              value={favoriteCount}
              className="[--digit-dur:var(--duration-fast)]"
            />
          </p>
        </Press>

        <Press
          as={Link}
          to={`/photolab/${photoLab.id}`}
          className="block rounded-2xl"
          aria-label={`${photoLab.name} 상세로 이동`}
        >
          {/* 세부 내용 */}
          <div className="flex gap-3">
            {/* 이미지 */}
            <img
              src={photoLab.imageUrls?.[0] || photoLabPlaceholder}
              alt={photoLab.name}
              className="h-[3.75rem] w-[3.75rem] rounded-md object-cover"
            />
            <section className="flex flex-col p-1">
              <h2 className="text-[1.175rem] font-semibold tracking-[-0.0225rem] text-neutral-100">
                {photoLab.name}
              </h2>

              {/* 주소 + 거리 */}
              <section className="mt-1 flex items-center gap-1 text-[0.85rem] font-light text-neutral-200">
                <span>{photoLab.address}</span>
                {photoLab.distanceKm != null && (
                  <span>({photoLab.distanceKm.toFixed(1)}km)</span>
                )}
              </section>
            </section>
          </div>
        </Press>
      </div>
    </div>
  );
};
