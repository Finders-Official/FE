import BottomSheet from "@/components/common/BottomSheet";
import type { PostComment } from "@/types/photoFeed/postDetail";
import Profile from "./Profile";
import CommentInput from "./CommentInput";
import { useState } from "react";
import { useCreateComment } from "@/hooks/photoFeed/comments/useCreateComment";

type CommentSheetProps = {
  isCommentPending: boolean;
  isCommentError: boolean;
  open: boolean;
  onClose: () => void;
  comments: PostComment[];
  postId: number;
};

export default function CommentSheet({
  isCommentPending,
  isCommentError,
  open,
  onClose,
  comments,
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
            <div className="flex flex-col gap-5">
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
