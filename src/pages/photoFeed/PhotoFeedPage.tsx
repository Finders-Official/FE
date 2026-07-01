import { useState, useRef, useEffect } from "react";
import PhotoCard from "@/components/photoFeed/mainFeed/PhotoCard";
import NewPostFab from "@/components/photoFeed/mainFeed/NewPostFab";
import NewPostModal from "@/components/photoFeed/upload/NewPostModal";
import { CheckCircleIcon, SearchIcon } from "@/assets/icon";
import { Header, Toast } from "@/components/common";
import { useLocation, useNavigate } from "react-router";
import { useInfinitePosts } from "@/hooks/photoFeed";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useFirstPageStagger } from "@/hooks/common/useFirstPageStagger";
import PhotoCardSkeleton from "@/components/photoFeed/mainFeed/PhotoCardSkeleton";
import Masonry from "react-masonry-css";

const SKELETON_COUNT = 8;

const SKELETON_HEIGHTS = [
  "h-[180px]",
  "h-[220px]",
  "h-[260px]",
  "h-[300px]",
  "h-[340px]",
];

const breakpointColumnsObj = {
  default: 2, // 디자인이 2열이면 고정이 가장 안정적
  768: 2,
  1024: 2,
};

export default function PhotoFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 게시글 삭제 여부 정보
  const navigate = useNavigate();
  const location = useLocation();

  // 최초 진입 시점의 삭제 여부를 로컬로 "고정"한다.
  // (라우터 state를 직접 읽으면, 아래에서 state를 비운 뒤 뒤로가기로 재진입 시 값이 흔들림)
  const [isDeleted] = useState(
    () => !!(location.state as { isDeleted?: boolean } | null)?.isDeleted,
  );

  // 토스트 메세지 관련 상태
  const [toastOpen, setToastOpen] = useState(isDeleted);

  // 라우터 state를 "즉시" 비운다.
  // 토스트가 닫힐 때 지우면, 그 전에 다른 페이지로 이동할 경우 state가 남아
  // 뒤로가기로 돌아왔을 때 토스트가 다시 뜨는 버그가 생긴다.
  useEffect(() => {
    const state = location.state as { isDeleted?: boolean } | null;
    if (state?.isDeleted) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate]);

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
  const staggerIndexFor = useFirstPageStagger(posts.length);

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
        className="sticky top-0 z-50 bg-neutral-900"
      />

      {/* 에러 처리 */}
      {isError && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <p className="text-red-400">불러오기에 실패했어요.</p>
        </div>
      )}

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="게시글이 삭제되었습니다"
        icon={<CheckCircleIcon className="h-5 w-5" />}
      />

      {/* Masonry 레이아웃 */}
      <section className="mb-20">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => {
                const heightClass =
                  SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length];

                return (
                  <PhotoCardSkeleton
                    key={`skeleton-${i}`}
                    className={heightClass}
                  />
                );
              })
            : posts.map((postPreview, index) => (
                <PhotoCard
                  key={postPreview.postId}
                  photo={postPreview}
                  isLiked={postPreview.isLiked}
                  staggerIndex={staggerIndexFor(index)}
                />
              ))}
        </Masonry>
      </section>

      {/* 새 게시물 작성 플로팅 버튼 */}
      <NewPostFab onClick={() => setIsCreateModalOpen(true)} />

      <NewPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 센티널 요소 */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </main>
  );
}

/**
 * CO-010 PhotoFeedPage.tsx
 * Description: 사진수다 전체 피드 페이지
 */
