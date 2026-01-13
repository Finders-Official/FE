import { BriefcaseIcon, ClockIcon, StarIcon } from "@/assets/icon";
import type { PhotoLab } from "@/types/mypage/photolab";
import { Link } from "react-router";

type props = {
  photoLab: PhotoLab;
  onToggleLike?: (id: number) => void; //TODO: api 연동 사용
};

export const PhotoLabCard = ({ photoLab }: props) => {
  const starColorClass = photoLab.isFavorite
    ? "fill-orange-500 text-orange-500"
    : "fill-none text-white";
  return (
    <div className="border-neutral-875 mt-2 border-b p-4">
      <div className="group relative">
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
            <span>({photoLab.distanceKm}km)</span>
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
        {photoLab.isFavorite ? (
          <StarIcon
            className={`absolute top-1 right-1 h-6 w-6 ${starColorClass}`}
          />
        ) : null}
      </div>
    </div>
  );
};
