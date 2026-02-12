import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PostCard } from "@/components/mypage/PostCard";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import type { Post } from "@/types/mypage/post";
import { useMyPostsInfinite } from "@/hooks/my";
import { EmptyOrderState, PostCardSkeleton } from "@/components/mypage";
import { formatYmdDot } from "@/utils/dateFormat";
import { useLocation, useNavigate } from "react-router";
import { ToastItem } from "@/components/common";
import { CheckCircleIcon } from "@/assets/icon";

const SKELETON_COUNT = 6;

type LocationState = { isDeleted?: boolean } | null;

export function MyPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;

  //최초 1회만 삭제 트리거 캡처
  const [toastTrigger] = useState(() => Boolean(state?.isDeleted));

  const [toastVisible, setToastVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!toastTrigger) return;

    //state는 바로 제거
    navigate(location.pathname, { replace: true, state: null });

    setMounted(true);
    setToastVisible(true);

    const fadeTimer = window.setTimeout(() => setToastVisible(false), 1600);
    const removeTimer = window.setTimeout(() => setMounted(false), 3000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toastTrigger, navigate, location.pathname]);

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
        date: formatYmdDot(p.createdAt),
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

  const shouldShowSentinel =
    !isLoading && !isError && hasNextPage && posts.length > 0;

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

  return (
    <div className="flex min-h-0 flex-1 flex-col py-4">
      <main className="flex min-h-0 flex-1 flex-col px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PostCardSkeleton key={`post-skeleton-${i}`} />
            ))}
          </div>
        ) : posts.length === 0 && !isFetchingNextPage ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState description="아직 기록된 나만의 사진이 없어요" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="mt-3 text-center text-sm text-neutral-300">
                더 불러오는 중...
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <div className="mt-3 text-center text-sm text-neutral-500" />
            )}

            {shouldShowSentinel ? <div ref={bottomRef} /> : null}
          </>
        )}

        {mounted && (
          <div className="fixed right-0 bottom-0 left-0 z-[100] flex justify-center px-5 py-5">
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
      </main>
    </div>
  );
}
