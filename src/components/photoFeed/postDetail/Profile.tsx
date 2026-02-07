import { DefaultProfileIcon, EllipsisVerticalIcon } from "@/assets/icon";
import { useMemo, useState } from "react";
import ActionSheet from "./ActionSheet";
import { timeAgo } from "@/utils/timeAgo";
import { useDeletePost, useDeleteComment } from "@/hooks/photoFeed";
import { useNavigate } from "react-router";

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

type Action = {
  label: string;
  variant?: "danger";
  onClick: () => void | Promise<void>;
};

function formatKoreanDate(iso: string) {
  // "2026-02-08T12:34:56" -> "2026년 2월 8일"
  const [splitDate] = iso.split("T");
  const [year, month, day] = splitDate.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

async function shareCurrentUrl() {
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({
      title: "파인더스",
      text: "게시글 공유",
      url,
    });
    return;
  }

  await navigator.clipboard.writeText(url);
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
  const navigate = useNavigate();
  const [moreMenu, setMoreMenu] = useState(false);

  const { mutate: deletePost } = useDeletePost();
  const { mutate: deleteComment } = useDeleteComment();

  const isPost = type === "post";
  const isComment = type === "comment";

  const time = useMemo(() => timeAgo(date), [date]);
  const formattedDate = useMemo(() => formatKoreanDate(date), [date]);

  const actions: Action[] = useMemo(() => {
    // ✅ 메뉴 없는 케이스는 빈 배열
    if (isComment && !isOwner) return [];
    if (isPost && !isOwner) {
      return [
        {
          label: "공유하기",
          onClick: async () => {
            await shareCurrentUrl();
            setMoreMenu(false);
          },
        },
      ];
    }

    if (isPost && isOwner) {
      return [
        {
          label: "공유하기",
          onClick: async () => {
            await shareCurrentUrl();
            setMoreMenu(false);
          },
        },
        {
          label: "삭제하기",
          variant: "danger",
          onClick: () => {
            deletePost(objectId);
            setMoreMenu(false);
            navigate("/photoFeed", { state: { isDeleted: true } });
          },
        },
      ];
    }

    // comment + owner
    return [
      {
        label: "삭제하기",
        variant: "danger",
        onClick: () => {
          deleteComment(objectId);
          setMoreMenu(false);
        },
      },
    ];
  }, [
    deleteComment,
    deletePost,
    isComment,
    isOwner,
    isPost,
    navigate,
    objectId,
  ]);

  const showMenu = actions.length > 0;

  return (
    <div className="flex items-start gap-2">
      {/* avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={userName ?? "프로필"}
          className="h-9 w-9 rounded-full"
          width={36}
          height={36}
        />
      ) : (
        <DefaultProfileIcon
          className="h-9 w-9 rounded-full"
          width={36}
          height={36}
        />
      )}

      {/* content */}
      <div className="flex flex-1 flex-col">
        {isPost && (
          <>
            <p className="text-[0.8125rem] font-semibold text-neutral-200">
              {userName}
            </p>
            <p className="text-[0.75rem] font-light text-neutral-400">
              {formattedDate}
            </p>
          </>
        )}

        {isComment && (
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

      {/* menu icon */}
      {showMenu && (
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="더보기"
          onClick={() => setMoreMenu(true)}
        >
          <EllipsisVerticalIcon className="h-4 w-[3px]" />
        </button>
      )}

      {/* ActionSheet (딱 1번만) */}
      {showMenu && (
        <ActionSheet
          open={moreMenu}
          onClose={() => setMoreMenu(false)}
          actions={actions}
        />
      )}
    </div>
  );
}
