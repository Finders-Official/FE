import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useLikedPostsInfinite } from "@/hooks/my";
import { useCallback, useMemo, useRef, useState } from "react";
import PhotoCard from "@/components/photoFeed/mainFeed/PhotoCard";
import PhotoCardSkeleton from "@/components/photoFeed/mainFeed/PhotoCardSkeleton";
import { useLikePost, useUnlikePost } from "@/hooks/photoFeed";
import { EmptyOrderState } from "@/components/mypage";
import Masonry from "react-masonry-css";

const SKELETON_COUNT = 8;

const SKELETON_HEIGHTS = [
  "h-[180px]",
  "h-[220px]",
  "h-[260px]",
  "h-[300px]",
  "h-[340px]",
];

const breakpointColumnsObj = {
  default: 2,
  768: 2,
  1024: 2,
};

export function LikedPostPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useLikedPostsInfinite(10);

  const { mutate: unlikePost } = useUnlikePost();
  const { mutate: likePost } = useLikePost();

  const [likedOverrideById, setLikedOverrideById] = useState<
    Record<number, boolean>
  >({});

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.data.previewList) ?? [],
    [data],
  );

  const viewItems = useMemo(() => {
    return items.map((p) => {
      const override = likedOverrideById[p.postId];
      const nextIsLiked = typeof override === "boolean" ? override : p.isLiked;
      return { ...p, isLiked: nextIsLiked };
    });
  }, [items, likedOverrideById]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useInfiniteScroll({
    target: bottomRef,
    onIntersect: handleIntersect,
    enabled: !isLoading && !isError,
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  const shouldShowSentinel =
    !isLoading && !isError && hasNextPage && viewItems.length > 0;

  const handleToggleLike = useCallback(
    (postId: number, prevIsLiked: boolean) => {
      // 1) UI 즉시 반영
      setLikedOverrideById((prev) => ({
        ...prev,
        [postId]: !prevIsLiked,
      }));

      // 2) 서버 호출(토글 전 상태 기준)
      if (prevIsLiked) {
        unlikePost(postId, {
          onError: () => {
            // 3) 실패 롤백
            setLikedOverrideById((prev) => ({
              ...prev,
              [postId]: prevIsLiked,
            }));
          },
        });
      } else {
        likePost(postId, {
          onError: () => {
            setLikedOverrideById((prev) => ({
              ...prev,
              [postId]: prevIsLiked,
            }));
          },
        });
      }
    },
    [likePost, unlikePost],
  );

  if (isError) {
    return (
      <div className="p-6 text-neutral-100">
        <p className="text-red-400">불러오기 실패</p>
        <button
          type="button"
          className="mt-3 rounded-md border border-neutral-700 px-3 py-2 text-sm"
          onClick={() => refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => {
              const heightClass = SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length];
              return (
                <PhotoCardSkeleton
                  key={`skeleton-${i}`}
                  className={heightClass}
                />
              );
            })}
          </Masonry>
        ) : viewItems.length === 0 && !isFetchingNextPage ? (
          <div className="flex flex-1 items-center justify-center px-4">
            <EmptyOrderState description="아직 마음에 드는 글을 담지 않았어요" />
          </div>
        ) : (
          <>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {viewItems.map((photo) => (
                <PhotoCard
                  key={photo.postId}
                  photo={photo}
                  isLiked={photo.isLiked}
                  isShowLiked={true}
                  onToggleLike={() =>
                    handleToggleLike(photo.postId, photo.isLiked)
                  }
                />
              ))}
            </Masonry>

            {isFetchingNextPage && (
              <div className="mt-3 text-center text-sm text-neutral-300">
                더 불러오는 중...
              </div>
            )}

            {!hasNextPage && viewItems.length > 0 && (
              <div className="mt-3 text-center text-sm text-neutral-500" />
            )}

            {shouldShowSentinel ? <div ref={bottomRef} /> : null}
          </>
        )}
      </main>
    </div>
  );
}
