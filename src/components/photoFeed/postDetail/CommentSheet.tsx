import BottomSheet from "@/components/common/BottomSheet";
import Profile from "./Profile";
import CommentInput from "./CommentInput";
import { useRef, useState } from "react";
import { useCreateComment, useInfiniteComments } from "@/hooks/photoFeed";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";

type CommentSheetProps = {
  open: boolean;
  onClose: () => void;
  postId: number;
};

export default function CommentSheet({
  open,
  onClose,
  postId,
}: CommentSheetProps) {
  // 댓글 input
  const [comment, setComment] = useState("");

  // 게시글 댓글 작성
  const { mutate: createComment, isPending: isCreating } = useCreateComment();

  // 댓글 작성 핸들러
  const handleSubmit = () => {
    const trimmed = comment.trim();
    if (!trimmed || isCreating) return;

    createComment(
      { postId, content: trimmed },
      {
        onSuccess: () => setComment(""),
      },
    );
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 게시글 댓글 조회
  const {
    data,
    fetchNextPage,
    isPending: isCommentPending,
    isError: isCommentError,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteComments(postId);
  const comments = data?.pages.flatMap((c) => c.data) ?? [];

  const onIntersect = () => fetchNextPage();

  useInfiniteScroll({
    target: sentinelRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: onIntersect,
  });

  return (
    <BottomSheet open={open} onClose={onClose} title="댓글">
      <div className="flex h-full flex-col gap-1">
        <div className="flex-1 overflow-y-auto p-4">
          {isCommentPending ? (
            <div className="py-6 text-center text-neutral-400">
              불러오는 중...
            </div>
          ) : isCommentError ? (
            <div className="flex items-center justify-center py-6 text-red-400">
              데이터 불러오기에 실패했어요.
            </div>
          ) : (
            <div className="flex flex-col gap-5 pb-7">
              {comments.map(
                ({
                  commentId,
                  nickname,
                  profileImageUrl,
                  content,
                  createdAt,
                  isMine,
                }) => (
                  <Profile
                    key={commentId}
                    type="comment"
                    userName={nickname}
                    avatarUrl={profileImageUrl}
                    comment={content}
                    date={createdAt}
                    isOwner={isMine}
                    objectId={commentId}
                  />
                ),
              )}
            </div>
          )}
          {/* 센티널 요소 */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>

        <div className="bg-neutral-875 h-10 shrink-0">
          <CommentInput
            value={comment}
            onChange={setComment}
            onSubmit={handleSubmit}
            placeholder="이 현상에 대한 이야기를 남겨보세요!"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
