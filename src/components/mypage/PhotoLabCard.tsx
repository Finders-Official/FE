import { useState } from "react";
import { BriefcaseIcon, ClockIcon, StarIcon } from "@/assets/icon";
import type { PhotoLab } from "@/types/mypage/photolab";
import { Link } from "react-router";

type Props = {
  photoLab: PhotoLab;
  onToggleLike?: (id: number, isFavorite: boolean) => void; // 서버 토글(현재값 기준)
};

export const PhotoLabCard = ({ photoLab, onToggleLike }: Props) => {
  //Optimistic UI 상태
  const [prevFavorite, setPrevFavorite] = useState(photoLab.isFavorite);
  const [isFavorite, setIsFavorite] = useState(photoLab.isFavorite);

  //서버/캐시에서 isFavorite가 바뀌어 내려오면 로컬 상태 동기화
  if (photoLab.isFavorite !== prevFavorite) {
    setPrevFavorite(photoLab.isFavorite);
    setIsFavorite(photoLab.isFavorite);
  }

  const starColorClass = isFavorite
    ? "fill-orange-500 text-orange-500"
    : "fill-none text-white";

  return (
    <div className="border-neutral-875 mt-2 border-b p-4">
      <div className="group relative">
        {/*즐겨찾기 버튼: 클릭 시 링크 이동 방지 + UI 즉시 토글 */}
        <button
          type="button"
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
          className="absolute top-1 right-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            // 1) UI는 즉시 토글
            setIsFavorite((prev) => !prev);

            // 2) 서버에는 현재값을 넘김
            onToggleLike?.(photoLab.id, photoLab.isFavorite);
          }}
        >
          <StarIcon className={`h-6 w-6 ${starColorClass}`} />
        </button>

        <Link
          to={`/photolab/${photoLab.id}`}
          className="block rounded-2xl"
          aria-label={`${photoLab.name} 상세로 이동`}
        >
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.0225rem] text-neutral-100">
            {photoLab.name}
          </h2>

          {/* 태그 */}
          <section className="mt-3 flex flex-wrap gap-2">
            {photoLab.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-flex items-center rounded-md bg-[rgba(233,78,22,0.40)] p-1 text-[0.725rem] text-orange-200"
              >
                {tag}
              </span>
            ))}
          </section>

          {/* 주소 + 거리 */}
          <section className="mt-1 flex items-center gap-1 text-[0.85rem] font-light text-neutral-200">
            <span>{photoLab.address}</span>
            <span>({photoLab.distanceText}km)</span>
          </section>

          {/* 하단 지표 */}
          <section className="mt-2 flex items-center gap-3 text-[0.85rem] font-light text-neutral-200">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-3 w-3" />
              <span>
                총 작업 건 수 <span>{photoLab.totalWorkCount}건</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ClockIcon className="h-3 w-3" />
              <span>
                작업 소요 시간 <span>{photoLab.estimatedMinutes}분</span>
              </span>
            </div>
          </section>
        </Link>
      </div>
    </div>
  );
};
