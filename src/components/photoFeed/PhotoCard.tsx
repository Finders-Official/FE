import type { Photo } from "@/types/photo";
import { Link } from "react-router";

type Props = {
  photo: Photo;
};

export default function PhotoCard({ photo }: Props) {
  return (
    <div className="mb-4 [break-inside:avoid]">
      <Link to={`/post/${photo.id}`} className="group w-[162px]">
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
        <div className="mt-1 text-[10px] break-words text-white">
          {photo.title}
        </div>
      </Link>
    </div>
  );
}
