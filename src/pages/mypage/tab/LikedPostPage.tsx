import PhotoCard from "@/components/photoFeed/PhotoCard";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useLikedPostsInfinite } from "@/hooks/my";
import { useCallback, useMemo, useRef } from "react";

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

  // 서버 pages -> flat list
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.data.previewList) ?? [],
    [data],
  );

  // 바닥 감지용 sentinel
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

  if (isLoading) {
    return <div className="p-6 text-neutral-100">로딩중...</div>;
  }

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
    <div className="px-4 py-6">
      <main className="rounded-md border border-neutral-800 p-5 text-neutral-100">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[1rem] font-semibold">좋아요한 게시물</h2>
          <p className="text-xs text-neutral-400">
            {data?.pages?.[0]?.data.totalCount ?? 0}개
          </p>
        </div>

        {/* Masonry 느낌: PhotoCard가 break-inside:avoid 쓰고 있어서 columns가 잘 맞음 */}
        <div className="columns-2 gap-4">
          {items.map((photo) => (
            <PhotoCard
              key={photo.postId}
              photo={photo}
              isLiked={true}
              // onToggleLike={...}  // 나중에 좋아요 해제 API 붙일 때 여기 연결
            />
          ))}
        </div>

        {/* sentinel */}
        <div ref={bottomRef} className="h-10" />

        {isFetchingNextPage && (
          <div className="mt-3 text-center text-sm text-neutral-300">
            더 불러오는 중...
          </div>
        )}

        {!hasNextPage && items.length > 0 && (
          <div className="mt-3 text-center text-sm text-neutral-500">
            마지막 페이지야
          </div>
        )}

        {items.length === 0 && !isFetchingNextPage && (
          <div className="py-10 text-center text-sm text-neutral-400">
            아직 좋아요한 게시물이 없어
          </div>
        )}
      </main>
    </div>
  );
}
