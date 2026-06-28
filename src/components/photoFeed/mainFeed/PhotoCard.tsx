import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { HeartIcon } from "@/assets/icon";
import { IconSwap } from "@/components/common";
import type { PostPreview } from "@/types/photoFeed/postPreview";
import { Link } from "react-router";

type Props = {
  photo: PostPreview;
  isLiked?: boolean; // optional override (없으면 photo.isLiked 사용)
  isShowLiked?: boolean; // 포토 카드에서 좋아요 표시 여부
  onToggleLike?: (id: string) => void;
  staggerIndex?: number;
};

export default function PhotoCard({
  photo,
  isLiked,
  onToggleLike,
  isShowLiked,
  staggerIndex,
}: Props) {
  const { width, height } = photo.image;
  const aspect = width && height ? `${width} / ${height}` : "1 / 1";

  // 서버/상위에서 내려오는 현재값
  const likedFromProps = isLiked ?? photo.isLiked;

  // Optimistic UI 상태
  const [prevLikedFromProps, setPrevLikedFromProps] = useState(likedFromProps);
  const [optimisticLiked, setOptimisticLiked] = useState(likedFromProps);

  // 상위값이 바뀌면 로컬 optimistic 상태를 동기화
  if (likedFromProps !== prevLikedFromProps) {
    setPrevLikedFromProps(likedFromProps);
    setOptimisticLiked(likedFromProps);
  }

  const [shown, setShown] = useState(staggerIndex === undefined);
  useEffect(() => {
    if (staggerIndex === undefined) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [staggerIndex]);

  const staggerClass =
    staggerIndex === undefined ? "" : `t-stagger-item${shown ? " is-in" : ""}`;

  const handleClickLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation();

    // UI 즉시 반영
    setOptimisticLiked((prev) => !prev);

    // 서버 토글 트리거
    onToggleLike?.(photo.postId);
  };

  return (
    <div
      className={`[break-inside:avoid] ${staggerClass}`}
      style={
        staggerIndex !== undefined
          ? ({ "--i": staggerIndex } as CSSProperties)
          : undefined
      }
    >
      <div className="group relative">
        <Link to={`/photoFeed/post/${photo.postId}`} className="block w-full">
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
            <div className="ease-smooth-out pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100" />
          </div>

          <div className="mt-1 text-[0.625rem] break-words text-white">
            {photo.title}
          </div>
        </Link>

        {isShowLiked ? (
          <button
            type="button"
            className="absolute right-2 bottom-7"
            onClick={handleClickLike}
            aria-label="좋아요 토글"
            aria-pressed={optimisticLiked}
          >
            <IconSwap
              active={optimisticLiked}
              bounce
              className="h-6 w-6"
              iconA={<HeartIcon className="h-6 w-6 fill-none text-white" />}
              iconB={
                <HeartIcon className="h-6 w-6 fill-orange-500 text-orange-500" />
              }
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
