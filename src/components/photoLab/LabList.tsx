import { useCallback, useRef } from "react";
import type { SimplePhotoLabItem } from "@/types/photoLab";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
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
}: LabListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    <div className={`flex flex-col ${className}`}>
      {labs.map((lab) => (
        <SimpleLabCard
          key={lab.photoLabId}
          lab={lab}
          onFavoriteToggle={onFavoriteToggle}
          onCardClick={onCardClick}
        />
      ))}

      {/* 무한스크롤 트리거 */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}

export type { LabListProps };
