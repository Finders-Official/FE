import { useCallback, useMemo, useRef, useState } from "react";
import {
  EmptyOrderState,
  PhotoLabCard,
  PhotoLabCardSkeleton,
} from "@/components/mypage";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import type { PhotoLab } from "@/types/mypage/photolab";
import { useLikedPhotoLabsInfinite } from "@/hooks/my";
import { useFavoriteToggle } from "@/hooks/photoLab";

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
  const [favoriteOverrideById, setFavoriteOverrideById] = useState<
    Record<number, boolean>
  >({});

  const { mutate: toggleFavorite } = useFavoriteToggle();

  const labs: PhotoLab[] = useMemo(() => {
    return labsDto.map((l) => {
      const override = favoriteOverrideById[l.photoLabId];
      const isFavorite =
        typeof override === "boolean" ? override : l.isFavorite;

      return {
        id: l.photoLabId,
        name: l.name,
        imageUrls: l.imageUrls,
        tags: l.tags,
        address: l.address,
        distanceText: l.distance,
        isFavorite,
        totalWorkCount: l.totalWorkCount,
        estimatedMinutes: l.avgWorkTime,
      };
    });
  }, [labsDto, favoriteOverrideById]);

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

  const shouldShowSentinel =
    !isLoading && !isError && hasNextPage && labs.length > 0;

  const isEmpty = !isLoading && !isFetchingNextPage && labs.length === 0;

  const handleFavoriteToggle = useCallback(
    (photoLabId: number, prevIsFavoriteFromCard: boolean) => {
      setFavoriteOverrideById((prev) => ({
        ...prev,
        [photoLabId]: !prevIsFavoriteFromCard,
      }));

      toggleFavorite(
        { photoLabId, isFavorite: prevIsFavoriteFromCard },
        {
          onError: () => {
            setFavoriteOverrideById((prev) => ({
              ...prev,
              [photoLabId]: prevIsFavoriteFromCard,
            }));
          },
        },
      );
    },
    [toggleFavorite],
  );

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
    //이 페이지 자체가 스크롤을 만들지 않게 루트에서 차단
    <div className="flex min-h-0 flex-col overflow-hidden">
      <main
        className={[
          "flex min-h-0 flex-1 flex-col px-4",
          isEmpty ? "overflow-hidden" : "scrollbar-hide overflow-y-auto",
        ].join(" ")}
      >
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PhotoLabCardSkeleton key={`post-skeleton-${i}`} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState description="아직 마음에 담아둔 현상소가 없어요" />
          </div>
        ) : (
          <>
            {labs.map((photolab) => (
              <PhotoLabCard
                key={photolab.id}
                photoLab={photolab}
                onToggleLike={handleFavoriteToggle}
              />
            ))}

            {isFetchingNextPage && (
              <div className="py-2 text-center text-sm text-neutral-300">
                더 불러오는 중...
              </div>
            )}

            {!hasNextPage && labs.length > 0 && (
              <div className="py-2 text-center text-sm text-neutral-500" />
            )}

            {shouldShowSentinel ? <div ref={bottomRef} /> : null}
          </>
        )}
      </main>
    </div>
  );
}
