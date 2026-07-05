import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import {
  PAGE_SIZE,
  type PhotoFeedResponse,
  type PostPreview,
} from "@/types/photoFeed/postPreview";

/** 사진수다 메인 피드 무한쿼리 키 (useInfinitePosts와 동일해야 함) */
export const PHOTO_FEED_QK = ["photoFeed", PAGE_SIZE] as const;

type FeedCache = InfiniteData<PhotoFeedResponse>;

/**
 * 피드 무한쿼리 캐시에서 특정 게시글 한 건을 patch한다.
 * - 캐시에 없거나 해당 글이 로드되지 않았으면 no-op (안전)
 * - refetchOnMount:false인 피드를 전체 리페치 없이 즉시 최신화하는 용도
 * @returns 롤백용 이전 캐시 스냅샷
 */
export function patchPostInFeed(
  queryClient: QueryClient,
  postId: string,
  patch: (p: PostPreview) => PostPreview,
): FeedCache | undefined {
  const prev = queryClient.getQueryData<FeedCache>(PHOTO_FEED_QK);

  queryClient.setQueryData<FeedCache>(PHOTO_FEED_QK, (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        previewList: page.previewList.map((p) =>
          p.postId === postId ? patch(p) : p,
        ),
      })),
    };
  });

  return prev;
}

/** 롤백: 스냅샷이 있으면 피드 캐시를 되돌린다. */
export function restoreFeedCache(
  queryClient: QueryClient,
  snapshot: FeedCache | undefined,
) {
  if (snapshot) {
    queryClient.setQueryData(PHOTO_FEED_QK, snapshot);
  }
}
