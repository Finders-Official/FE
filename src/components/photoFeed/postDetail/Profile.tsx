import { DefaultProfileIcon, EllipsisVerticalIcon } from "@/assets/icon";
import { useCallback, useMemo, useState } from "react";
import ActionSheet, { type ActionSheetAction } from "./ActionSheet";
import { timeAgo } from "@/utils/timeAgo";
import { useDeletePost, useDeleteComment } from "@/hooks/photoFeed";
import { useLocation, useNavigate } from "react-router";

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
  const location = useLocation();
  // 내가 쓴 게시글에서 진입해서 삭제시 내가 쓴 게시글로 리다이렉 처리
  const fromMyPost = location.state === "mypost";
  const afterDeletePath = fromMyPost ? "/mypage/my-posts" : "/photoFeed";

  const [moreMenu, setMoreMenu] = useState(false);

  const { mutateAsync: deletePostAsync, isPending: isPostPending } =
    useDeletePost();
  const { mutateAsync: deleteCommentAsync, isPending: isCommentPending } =
    useDeleteComment();

  const isPost = type === "post";
  const isComment = type === "comment";

  const time = useMemo(() => timeAgo(date), [date]);
  const formattedDate = useMemo(() => formatKoreanDate(date), [date]);

  // 게시글 삭제 핸들러
  const handleDeletePost = useCallback(async () => {
    if (isPostPending) return;

    try {
      await deletePostAsync(objectId);
      setMoreMenu(false);
      navigate(afterDeletePath, { replace: true, state: { isDeleted: true } });
    } catch (e) {
      console.error(e); // TODO 토스트 메세지
    }
  }, [isPostPending, deletePostAsync, objectId, navigate, afterDeletePath]);

  // 코멘트 삭제 핸들러
  const handleDeleteComment = useCallback(async () => {
    if (isCommentPending) return;

    try {
      await deleteCommentAsync(objectId);
      setMoreMenu(false);
    } catch (e) {
      console.error(e); // TODO 토스트 메세지
    }
  }, [isCommentPending, deleteCommentAsync, objectId]);

  const actions: ActionSheetAction[] = useMemo(() => {
    // 메뉴 없는 케이스는 빈 배열
    if (isComment && !isOwner) return [];
    if (isPost && !isOwner) {
      return [
        {
          label: "공유하기",
          disabled: isPostPending,
          onClick: async () => {
            if (isPostPending) return;
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
          disabled: isPostPending,
          onClick: async () => {
            await shareCurrentUrl();
            setMoreMenu(false);
          },
        },
        {
          label: "삭제하기",
          disabled: isPostPending,
          variant: "danger",
          onClick: handleDeletePost,
        },
      ];
    }

    // comment + owner
    return [
      {
        label: "삭제하기",
        disabled: isCommentPending,
        variant: "danger",
        onClick: handleDeleteComment,
      },
    ];
  }, [
    handleDeletePost,
    handleDeleteComment,
    isComment,
    isOwner,
    isPost,
    isPostPending,
    isCommentPending,
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

      {/* ActionSheet */}
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
