import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likePost,
  unlikePost,
  type CommunityPost,
} from "@/apis/mainPage/mainPage.api";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";

interface CommunityGallerySectionCardProps {
  post: CommunityPost;
}

const COMMUNITY_PREVIEW_QK = ["community", "posts", "preview"] as const;

type LikeVars = { postId: number; nextLiked: boolean };
type LikeCtx = { previous?: CommunityPost[] };

function patchCommunityPreviewPost(
  prev: CommunityPost[] | undefined,
  postId: number,
  patch: (p: CommunityPost) => CommunityPost,
) {
  if (!prev) return prev;
  return prev.map((p) => (p.postId === postId ? patch(p) : p));
}

export default function CommunityGallerySectionCard({
  post,
}: CommunityGallerySectionCardProps) {
  const { requireAuth, requireAuthNavigate } = useRequireAuth();
  const queryClient = useQueryClient();

  const imageUrl = post.image.imageUrl;
  const fallbackImage =
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80";

  const likeMutation = useMutation<void, unknown, LikeVars, LikeCtx>({
    mutationFn: ({ postId, nextLiked }) =>
      nextLiked ? likePost(postId) : unlikePost(postId),

    onMutate: async ({ postId, nextLiked }) => {
      await queryClient.cancelQueries({ queryKey: COMMUNITY_PREVIEW_QK });

      const previous =
        queryClient.getQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK);

      queryClient.setQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK, (prev) =>
        patchCommunityPreviewPost(prev, postId, (p) => ({
          ...p,
          isLiked: nextLiked,
          likeCount: Math.max(0, p.likeCount + (nextLiked ? 1 : -1)),
        })),
      );

      return { previous };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(COMMUNITY_PREVIEW_QK, ctx.previous);
      }

      const message =
        err instanceof Error
          ? err.message
          : "좋아요 처리에 실패했어요. 잠시 후 다시 시도해주세요.";
      alert(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_PREVIEW_QK });
    },
  });

  const handleCardClick = () => {
    requireAuthNavigate(`/photoFeed/post/${post.postId}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    requireAuth(() => {
      if (likeMutation.isPending) return;

      likeMutation.mutate({
        postId: post.postId,
        nextLiked: !post.isLiked,
      });
    });
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuthNavigate(`/photoFeed/post/${post.postId}`, {
      state: { openCommentSheet: true },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-neutral-875 flex w-66.25 cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-800"
    >
      {/* 썸네일 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-800">
        <img
          src={imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* 하단 정보 영역 */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          {/* 좋아요 */}
          <button
            onClick={handleLikeClick}
            disabled={likeMutation.isPending}
            className="flex items-center justify-center transition-transform active:scale-90 disabled:opacity-60"
            aria-pressed={post.isLiked}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                className={`transition-colors duration-200 ${
                  post.isLiked
                    ? "fill-orange-500 stroke-orange-500"
                    : "fill-none stroke-neutral-200"
                }`}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-1 text-xs text-neutral-400">
              {post.likeCount}
            </span>
          </button>

          {/* 댓글 */}
          <button
            onClick={handleCommentClick}
            className="flex items-center justify-center transition-transform active:scale-90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-1 text-xs text-neutral-400">
              {post.commentCount}
            </span>
          </button>
        </div>

        <p className="font-regular line-clamp-2 min-h-7.5 text-[0.75rem] leading-[126%] tracking-[-0.02em] text-neutral-100">
          {post.title}
        </p>
      </div>
    </div>
  );
}
