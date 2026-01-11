import type { Photo } from "@/types/photo";
import { Link } from "react-router";

type Props = {
  photo: Photo;
  onToggleLike?: (id: number) => void; // 좋아요 해제 및 등록 api에 사용 예정
};

export default function PhotoCard({ photo }: Props) {
  return (
    <div className="mb-4 [break-inside:avoid]">
      <div className="group relative">
        <Link to={`/photoFeed/post/${photo.id}`} className="w-[10.125rem]">
          {/* 이미지 */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              className="block h-auto w-full"
            />

            {/* hover 오버레이 */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </div>

          {/* 제목 */}
          <div className="mt-1 text-[0.625rem] break-words text-white">
            {photo.title}
          </div>
        </Link>
      </div>
    </div>
  );
}
