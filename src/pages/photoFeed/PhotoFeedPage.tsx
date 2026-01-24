import { useEffect, useState, useRef } from "react";
import PhotoCard from "@/components/photoFeed/PhotoCard";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import { FloatingIcon, SearchIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { getPosts } from "@/apis/photoFeed/feed.api";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostPreview } from "@/types/photoFeed/postPreview";

const PAGE_SIZE = 20;

export default function PhotoFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PostPreview[], Error>({
    queryKey: ["photoFeed"],
    queryFn: () => getPosts(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
  });

  const posts = data?.pages.flat() ?? [];

  // Intersection Observer 설정
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]; // 관찰 중인 요소의 상태
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el); // 센티널 요소 관찰 시작
    return () => observer.disconnect(); // 컴포넌트 언마운트 시 관찰 중지
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="mx-auto max-w-6xl py-6">
      <Header
        title="사진수다"
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: () => {
            setIsCreateModalOpen(true);
          },
        }}
      />

      {/* 로딩/에러 처리 (최소) */}
      {isLoading && <div className="py-6 text-neutral-300">로딩 중…</div>}
      {isError && (
        <div className="py-6 text-red-400">불러오기에 실패했어요.</div>
      )}

      {/* Masonry 레이아웃 */}
      <section className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {posts.map((postPreview) => (
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
