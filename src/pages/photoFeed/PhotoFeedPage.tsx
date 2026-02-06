import { useState, useRef } from "react";
import PhotoCard from "@/components/photoFeed/mainFeed/PhotoCard";
import NewPostModal from "@/components/photoFeed/upload/NewPostModal";
import { FloatingIcon, SearchIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { useNavigate } from "react-router";
import { useInfinitePosts } from "@/hooks/photoFeed/posts/useInfinitePosts";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import PhotoCardSkeleton from "@/components/photoFeed/mainFeed/PhotoCardSkeleton";

const SKELETON_COUNT = 8;

const SKELETON_HEIGHTS = [
  "h-[180px]",
  "h-[220px]",
  "h-[260px]",
  "h-[300px]",
  "h-[340px]",
];

export default function PhotoFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  const onIntersect = () => fetchNextPage();

  useInfiniteScroll({
    target: sentinelRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: onIntersect,
  });

  const posts = data?.pages.flatMap((p) => p.previewList) ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl py-6">
      <Header
        title="사진수다"
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: () => {
            navigate("/photoFeed/search");
          },
        }}
      />

      {/* 에러 처리 */}
      {isError && (
        <div className="flex items-center justify-center py-6 text-red-400">
          불러오기에 실패했어요.
        </div>
      )}

      {/* Masonry 레이아웃 */}
      <section className="mb-20 columns-2 gap-4 md:columns-3 xl:columns-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => {
              const heightClass = SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length];

              return (
                <PhotoCardSkeleton
                  key={`skeleton-${i}`}
                  className={heightClass}
                />
              );
            })
          : posts.map((postPreview) => (
              <PhotoCard key={postPreview.postId} photo={postPreview} />
            ))}
      </section>

      {/* 새 게시물 작성 플로팅 버튼 */}
      <button
        type="button"
        aria-label="새 게시물 작성"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed right-6 bottom-[calc(var(--tabbar-height)+var(--fab-gap))] z-50 flex h-[3.5625rem] w-[3.5625rem]"
      >
        <FloatingIcon className="h-[3.5625rem] w-[3.5625rem]" />
      </button>

      {isCreateModalOpen && (
        <NewPostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* 센티널 요소 */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </main>
  );
}

/**
 * CO-010 PhotoFeedPage.tsx
 * Description: 사진수다 전체 피드 페이지
 */
