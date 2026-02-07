import { useCallback, useMemo, useRef } from "react";
import { PhotoLabCard, PhotoLabCardSkeleton } from "@/components/mypage";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import type { PhotoLab } from "@/types/mypage/photolab";
import { useLikedPhotoLabsInfinite } from "@/hooks/my";

const SKELETON_COUNT = 5;

export function LikedPhotoLabPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useLikedPhotoLabsInfinite(10);

  const labsDto = useMemo(
    () => data?.pages.flatMap((p) => p.data.photoLabs) ?? [],
    [data],
  );

  const labs: PhotoLab[] = useMemo(
    () =>
      labsDto.map((l) => ({
        id: l.photoLabId,
        name: l.name,
        imageUrls: l.imageUrls,
        tags: l.tags,
        address: l.address,
        distanceText: l.distance, // "1.5km"
        isFavorite: l.isFavorite,
        totalWorkCount: l.totalWorkCount,
        estimatedMinutes: l.avgWorkTime,
      })),
    [labsDto],
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useInfiniteScroll({
    target: bottomRef,
    onIntersect,
    enabled: !isLoading && !isError,
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  if (isError) {
    return (
      <div className="p-4 text-neutral-100">
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
    <div>
      <main className="px-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => {
              return <PhotoLabCardSkeleton key={`post-skeleton-${i}`} />;
            })
          : labs.map((photolab) => (
              <PhotoLabCard key={photolab.id} photoLab={photolab} />
            ))}

        {/* sentinel */}
        <div ref={bottomRef} className="h-10" />

        {isFetchingNextPage && (
          <div className="py-2 text-center text-sm text-neutral-300">
            더 불러오는 중...
          </div>
        )}

        {!hasNextPage && labs.length > 0 && (
          <div className="py-2 text-center text-sm text-neutral-500"></div>
        )}

        {labs.length === 0 && !isFetchingNextPage && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 text-center text-sm text-neutral-400">
            아직 관심 현상소가 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}
