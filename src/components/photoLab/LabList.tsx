import { useCallback, useMemo, useRef } from "react";
import type { SimplePhotoLabItem } from "@/types/photoLab";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useFirstPageStagger } from "@/hooks/common/useFirstPageStagger";
import { useFlipReorder } from "@/transitions";
import { StaggerItem } from "@/components/common";
import SimpleLabCard from "@/components/photoLab/SimpleLabCard";
import SimpleLabCardSkeleton from "@/components/photoLab/SimpleLabCardSkeleton";
import EmptyView from "@/components/common/EmptyView";

interface LabListProps {
  labs: SimplePhotoLabItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onFavoriteToggle?: (photoLabId: string, isFavorite: boolean) => void;
  onCardClick?: (photoLabId: string) => void;
  emptyMessage?: string;
  className?: string;
  /** 좋아요 수 내림차순 정렬 + 순위 이동 FLIP */
  reorderByFavorite?: boolean;
  // 값이 바뀌면 새 데이터셋으로 보고 첫 로드 stagger를 다시 허용 (검색어/필터 등)
  staggerResetKey?: unknown;
}

export default function LabList({
  labs,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onFavoriteToggle,
  onCardClick,
  emptyMessage = "현상소가 없습니다",
  className = "",
  reorderByFavorite = false,
  staggerResetKey,
}: LabListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const staggerIndexFor = useFirstPageStagger(labs.length, staggerResetKey);
  const orderedLabs = useMemo(
    () =>
      reorderByFavorite
        ? [...labs].sort((a, b) => b.favoriteCount - a.favoriteCount)
        : labs,
    [labs, reorderByFavorite],
  );
  const orderKey = orderedLabs.map((lab) => lab.photoLabId).join(",");
  const listRef = useFlipReorder<HTMLDivElement>(orderKey);

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  useInfiniteScroll({
    target: sentinelRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: handleIntersect,
    rootMargin: "100px",
    threshold: 0.1,
  });

  if (isLoading) {
    return (
      <div className={`flex flex-col ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SimpleLabCardSkeleton key={`lab-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (labs.length === 0) {
    return <EmptyView content={emptyMessage} />;
  }

  return (
    <div ref={listRef} className={`flex flex-col ${className}`}>
      {orderedLabs.map((lab, index) => (
        <StaggerItem key={lab.photoLabId} index={staggerIndexFor(index)}>
          <SimpleLabCard
            lab={lab}
            flipKey={lab.photoLabId}
            onFavoriteToggle={onFavoriteToggle}
            onCardClick={onCardClick}
          />
        </StaggerItem>
      ))}

      {/* 무한스크롤 트리거 */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}

export type { LabListProps };
