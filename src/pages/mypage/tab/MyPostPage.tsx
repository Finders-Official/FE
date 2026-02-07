import { useCallback, useMemo, useRef } from "react";
import { PostCard } from "@/components/mypage/PostCard";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import type { Post } from "@/types/mypage/post";
import { useMyPostsInfinite } from "@/hooks/my";
import { PostCardSkeleton } from "@/components/mypage";

const SKELETON_COUNT = 6;

export function MyPostPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMyPostsInfinite(10);

  const previews = useMemo(
    () => data?.pages.flatMap((p) => p.data.previewList) ?? [],
    [data],
  );

  const posts: Post[] = useMemo(
    () =>
      previews.map((p) => ({
        id: p.postId,
        src: p.image.imageUrl,
        title: p.title,
        likes: p.likeCount,
        date: "", // 서버가 createdAt 주면 여기서 변환해서 넣기
      })),
    [previews],
  );

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

  if (isError) {
    return (
      <div className="p-6 text-neutral-100">
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

  // const totalCount = data?.pages?.[0]?.data.totalCount ?? 0;

  return (
    <div className="px-4 py-6">
      <main>
        <div className="grid grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => {
                return <PostCardSkeleton key={`post-skeleton-${i}`} />;
              })
            : posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        <div ref={bottomRef} className="h-10" />

        {isFetchingNextPage && (
          <div className="mt-3 text-center text-sm text-neutral-300">
            더 불러오는 중...
          </div>
        )}

        {!hasNextPage && posts.length > 0 && (
          <div className="mt-3 text-center text-sm text-neutral-500"></div>
        )}

        {posts.length === 0 && !isFetchingNextPage && (
          <div className="py-10 text-center text-sm text-neutral-400">
            아직 작성한 게시물이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}
