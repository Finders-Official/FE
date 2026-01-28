import { HeartIcon } from "@/assets/icon";
import type { PostPreview } from "@/types/photoFeed/postPreview";
import { Link } from "react-router";

type Props = {
  photo: PostPreview;
  isLiked?: boolean;
  onToggleLike?: (id: number) => void; // 좋아요 해제 및 등록 api에 사용 예정
};

export default function PhotoCard({ photo, isLiked }: Props) {
  const { width, height } = photo.image;
  const aspect = width && height ? `${width} / ${height}` : "1 / 1";

  const heartColorClass = isLiked
    ? "fill-orange-500 text-orange-500"
    : "text-white fill-none ";
  return (
    <div className="mb-4 [break-inside:avoid]">
      <div className="group relative">
        <Link to={`/photoFeed/post/${photo.postId}`} className="w-[10.125rem]">
          {/* 이미지 */}
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-neutral-800/60"
            style={{ aspectRatio: aspect }}
          >
            <img
              src={photo.image.imageUrl}
              alt={photo.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* hover 오버레이 */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </div>

          {/* 제목 */}
          <div className="mt-1 text-[0.625rem] break-words text-white">
            {photo.title}
          </div>
        </Link>

        {isLiked ? (
          <button className="absolute right-2 bottom-7">
            <HeartIcon className={`h-6 w-6 ${heartColorClass}`} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
