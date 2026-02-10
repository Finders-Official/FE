import { useCallback, useRef } from "react";
import type { PhotoLabItem } from "@/types/photoLab";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import LabCard from "./LabCard";
import EmptyView from "@/components/common/EmptyView";

interface LabListProps {
  labs: PhotoLabItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onFavoriteToggle?: (photoLabId: number, isFavorite: boolean) => void;
  onCardClick?: (photoLabId: number) => void;
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

  // TODO: 스켈레톤 로딩 추가 예정
  if (isLoading) {
    return null;
  }

  if (labs.length === 0) {
    return <EmptyView content={emptyMessage} />;
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {labs.map((lab) => (
        <LabCard
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
