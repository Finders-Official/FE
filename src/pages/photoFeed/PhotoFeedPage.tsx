import { useState, useRef, useEffect } from "react";
import PhotoCard from "@/components/photoFeed/mainFeed/PhotoCard";
import NewPostModal from "@/components/photoFeed/upload/NewPostModal";
import { CheckCircleIcon, FloatingIcon, SearchIcon } from "@/assets/icon";
import { Header, ToastItem } from "@/components/common";
import { useLocation, useNavigate } from "react-router";
import { useInfinitePosts } from "@/hooks/photoFeed";
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

  // 게시글 삭제 여부 정보
  const navigate = useNavigate();
  const location = useLocation();
  const { isDeleted } = location.state ?? {};

  // 토스트 메세지 관련 상태
  const [toastVisible, setToastVisible] = useState(isDeleted);
  const [mounted, setMounted] = useState(isDeleted);

  useEffect(() => {
    if (!isDeleted) return;

    const fadeTimer = setTimeout(() => setToastVisible(false), 1600);
    const removeTimer = setTimeout(() => setMounted(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [isDeleted]);

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
    <main className="mx-auto w-full max-w-6xl pb-6">
      <Header
        title="사진수다"
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: () => {
            navigate("/photoFeed/search");
          },
        }}
        className="sticky top-0 z-50 bg-black"
      />

      {/* 에러 처리 */}
      {isError && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <p className="text-red-400">불러오기에 실패했어요.</p>
        </div>
      )}

      {/** toast 메세지 */}
      {isDeleted && mounted && (
        <div className="fixed right-0 bottom-0 left-0 z-100 flex justify-center px-5 py-5">
          <div
            className={`transition-opacity duration-300 ease-out ${
              toastVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ToastItem
              message="게시글이 삭제되었습니다"
              icon={<CheckCircleIcon className="h-5 w-5" />}
            />
          </div>
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
              <PhotoCard
                key={postPreview.postId}
                photo={postPreview}
                isLiked={false}
              />
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
