import { HeartIcon } from "@/assets/icon";
import type { PostPreview } from "@/types/photoFeed/postPreview";
import { Link } from "react-router";

type Props = {
  photo: PostPreview;
  isLiked?: boolean; // optional override (없으면 photo.isLiked 사용)
  onToggleLike?: (id: number) => void;
};

export default function PhotoCard({ photo, isLiked, onToggleLike }: Props) {
  const { width, height } = photo.image;
  const aspect = width && height ? `${width} / ${height}` : "1 / 1";

  const liked = isLiked ?? photo.isLiked;

  const heartColorClass = liked
    ? "fill-orange-500 text-orange-500"
    : "text-white fill-none";

  const handleClickLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation();
    onToggleLike?.(photo.postId);
  };

  return (
    <div className="mb-4 [break-inside:avoid]">
      <div className="group relative">
        <Link to={`/photoFeed/post/${photo.postId}`} className="w-[10.125rem]">
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
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </div>

          <div className="mt-1 text-[0.625rem] break-words text-white">
            {photo.title}
          </div>
        </Link>

        {liked ? (
          <button
            type="button"
            className="absolute right-2 bottom-7"
            onClick={handleClickLike}
            aria-label="좋아요 토글"
          >
            <HeartIcon className={`h-6 w-6 ${heartColorClass}`} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
