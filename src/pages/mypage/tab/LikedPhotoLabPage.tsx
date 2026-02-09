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

  /*
   * 페이지 안에서만 유지되는 즐겨찾기 상태 덮어쓰기 맵
   * 페이지를 나갔다 들어오면(컴포넌트 언마운트) 초기화됨 ->
   */
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

  /*
   * 클릭 당시 화면에 보이는 "현재 상태(prevIsFavorite)"를 기준으로 서버 호출
   * UI는 override로 즉시 토글
   * 실패 시 override 롤백
   */
  const handleFavoriteToggle = useCallback(
    (photoLabId: number, prevIsFavoriteFromCard: boolean) => {
      // 1) UI 즉시 반영(로컬 토글)
      setFavoriteOverrideById((prev) => ({
        ...prev,
        [photoLabId]: !prevIsFavoriteFromCard,
      }));

      // 2) 서버 호출은 "토글 전 현재값" 그대로 보냄
      toggleFavorite(
        { photoLabId, isFavorite: prevIsFavoriteFromCard },
        {
          onError: () => {
            // 3) 실패하면 롤백
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
    <div>
      <main className="px-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PhotoLabCardSkeleton key={`post-skeleton-${i}`} />
            ))
          : labs.map((photolab) => (
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
          <div className="py-2 text-center text-sm text-neutral-500"></div>
        )}

        {labs.length === 0 && !isFetchingNextPage && (
          <EmptyOrderState description="아직 마음에 담아둔 현상소가 없어요" />
        )}
      </main>
    </div>
  );
}
