import { useCallback, useMemo, useRef } from "react";
import {
  EmptyOrderState,
  PhotoLabCard,
  PhotoLabCardSkeleton,
} from "@/components/mypage";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useGeolocation } from "@/hooks/common/useGeolocation";
import type { PhotoLab } from "@/types/mypage/photolab";
import { useLikedPhotoLabsInfinite } from "@/hooks/my";
import { useFavoriteToggle } from "@/hooks/photoLab";
import { useFirstPageStagger } from "@/hooks/common/useFirstPageStagger";
import { ErrorState, StaggerItem } from "@/components/common";

const SKELETON_COUNT = 5;

export function LikedPhotoLabPage() {
  const {
    latitude,
    longitude,
    isLoading: isLocationLoading,
  } = useGeolocation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useLikedPhotoLabsInfinite(
    10,
    latitude ?? undefined,
    longitude ?? undefined,
    !isLocationLoading,
  );

  // 위치 확정 전에는 쿼리가 disabled(데이터 없음) → 빈 상태 대신 스켈레톤 유지
  const isInitialLoading = isLoading || isLocationLoading;

  const labsDto = useMemo(
    () => data?.pages.flatMap((p) => p.data.photoLabs) ?? [],
    [data],
  );

  const { mutate: toggleFavorite } = useFavoriteToggle();

  const labs: PhotoLab[] = useMemo(() => {
    return labsDto.map((l) => ({
      id: l.photoLabId,
      name: l.name,
      imageUrls: l.imageUrls,
      address: l.address,
      distanceKm: l.distanceKm,
      isFavorite: l.isFavorite,
      favoriteCount: l.favoriteCount,
    }));
  }, [labsDto]);

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

  const isEmpty = !isInitialLoading && !isFetchingNextPage && labs.length === 0;

  const staggerIndexFor = useFirstPageStagger(labs.length);

  const handleFavoriteToggle = useCallback(
    (photoLabId: string, prevIsFavoriteFromCard: boolean) => {
      toggleFavorite({ photoLabId, isFavorite: prevIsFavoriteFromCard });
    },
    [toggleFavorite],
  );

  if (isError) {
    return <ErrorState message="불러오기 실패" onRetry={() => refetch()} />;
  }

  return (
    //이 페이지 자체가 스크롤을 만들지 않게 루트에서 차단
    <div className="flex h-full flex-col overflow-hidden">
      <main
        className={[
          "flex min-h-0 flex-1 flex-col gap-1",
          isEmpty ? "overflow-hidden" : "scrollbar-hide overflow-y-auto",
        ].join(" ")}
      >
        {isInitialLoading ? (
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
            {labs.map((photolab, index) => (
              <StaggerItem key={photolab.id} index={staggerIndexFor(index)}>
                <PhotoLabCard
                  photoLab={photolab}
                  onToggleLike={handleFavoriteToggle}
                />
              </StaggerItem>
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
