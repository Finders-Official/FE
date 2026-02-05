import { EllipsisVerticalIcon } from "@/assets/icon";
import { useState } from "react";
import ActionSheet from "./ActionSheet";
import { timeAgo } from "@/utils/timeAgo";
import { useDeletePost } from "@/hooks/photoFeed/posts/useDeletePost";
import { useDeleteComment } from "@/hooks/photoFeed/comments/useDeleteComment";

type ProfileType = "post" | "comment";

interface ProfileProps {
  type: ProfileType;
  userName?: string;
  avatarUrl?: string;
  date: string;
  comment?: string;
  isOwner: boolean;
  objectId: number; // postId or commentId
}

export default function Profile({
  type,
  userName,
  avatarUrl,
  date,
  comment,
  isOwner,
  objectId,
}: ProfileProps) {
  const [moreMenu, setMoreMenu] = useState(false);

  // date에서 시간 추출
  const time = timeAgo(date);

  // 0000년 00월 00일 포맷으로 변환
  const [splitDate] = date.split("T");
  const [year, month, day] = splitDate.split("-");
  const formattedDate = `${year}년 ${Number(month)}월 ${Number(day)}일`;

  const { mutate: deletePost } = useDeletePost(objectId);
  const { mutate: deleteComment } = useDeleteComment(objectId);

  return (
    <div className="flex items-start gap-2">
      {/* avatar */}
      <img
        src={avatarUrl}
        alt={userName}
        className="h-9 w-9 rounded-full"
        width="36"
        height="36"
      />

      {/* content */}
      <div className="flex flex-1 flex-col">
        {type === "post" && (
          <>
            <p className="text-[0.8125rem] font-semibold text-neutral-200">
              {userName}
            </p>
            <p className="text-[0.75rem] font-light text-neutral-400">
              {formattedDate}
            </p>
          </>
        )}

        {type === "comment" && (
          <>
            <div className="flex gap-3">
              <p className="text-[0.8125rem] font-semibold text-neutral-200">
                {userName}
              </p>
              <p className="text-[0.75rem] font-light text-neutral-400">
                {time}
              </p>
            </div>
            <p className="text-[0.875rem] font-light text-neutral-200">
              {comment}
            </p>
          </>
        )}
      </div>

      {/* owner menu icon */}
      {isOwner && (
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="더보기"
          onClick={() => {
            setMoreMenu(true);
          }}
        >
          <EllipsisVerticalIcon className="h-4 w-[3px]" />
        </button>
      )}

      {/* more menu */}
      {moreMenu && type === "post" && (
        <ActionSheet
          open={moreMenu}
          onClose={() => setMoreMenu(false)}
          actions={[
            {
              label: "공유하기",
              onClick: async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: "파인더스",
                    text: "게시글 공유",
                    url: location.href,
                  });
                } else {
                  await navigator.clipboard.writeText(location.href);
                }
              },
            },
            {
              label: "삭제하기",
              variant: "danger",
              onClick: () => {
                deletePost();
              },
            },
          ]}
        />
      )}
      {moreMenu && type === "comment" && (
        <ActionSheet
          open={moreMenu}
          onClose={() => setMoreMenu(false)}
          actions={[
            {
              label: "삭제하기",
              variant: "danger",
              onClick: () => {
                deleteComment();
              },
            },
          ]}
        />
      )}
    </div>
  );
}
