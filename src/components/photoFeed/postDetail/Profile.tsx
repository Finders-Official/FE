import {
  CheckCircleIcon,
  DefaultProfileIcon,
  EllipsisVerticalIcon,
} from "@/assets/icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ActionSheet, { type ActionSheetAction } from "./ActionSheet";
import ReportSheet from "./ReportSheet";
import { ToastItem } from "@/components/common";
import { timeAgo } from "@/utils/timeAgo";
import {
  useDeletePost,
  useDeleteComment,
  useReportContent,
} from "@/hooks/photoFeed";
import { useLocation, useNavigate } from "react-router";
import { isAxiosError } from "axios";

type ProfileType = "post" | "comment";

interface ProfileProps {
  type: ProfileType;
  userName?: string;
  avatarUrl?: string;
  date: string;
  comment?: string;
  isOwner: boolean;
  objectId: string; // postId or commentId
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

  // 프로필 이미지 로드 실패 시 기본 아이콘으로 폴백
  // 어떤 src에서 실패했는지 기록해, avatarUrl이 바뀌면 다시 시도
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const showAvatarFallback = !avatarUrl || erroredSrc === avatarUrl;

  const { mutateAsync: deletePostAsync, isPending: isPostPending } =
    useDeletePost();
  const { mutateAsync: deleteCommentAsync, isPending: isCommentPending } =
    useDeleteComment();

  // 신고 사유 선택 시트 + 완료 토스트
  const [reportOpen, setReportOpen] = useState(false);
  const [reportedToast, setReportedToast] = useState(false);

  const { mutate: report, isPending: isReporting } = useReportContent({
    onSuccess: () => {
      setReportOpen(false);
      setReportedToast(true);
    },
    onError: (e) => {
      // 서버가 400 등으로 거부하면 실제 사유는 response.data에 담겨온다.
      if (isAxiosError(e)) {
        console.error("신고 실패", e.response?.status, e.response?.data);
      } else {
        console.error("신고 실패", e);
      }
    }, // TODO 실패 토스트
  });

  // 신고 완료 토스트 자동 숨김
  useEffect(() => {
    if (!reportedToast) return;
    const t = setTimeout(() => setReportedToast(false), 3000);
    return () => clearTimeout(t);
  }, [reportedToast]);

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
    // 타인 댓글: 공유하기 + 신고하기 (공유는 게시글과 동일 로직)
    if (isComment && !isOwner) {
      return [
        {
          label: "공유하기",
          onClick: async () => {
            await shareCurrentUrl();
            setMoreMenu(false);
          },
        },
        {
          label: "신고하기",
          onClick: () => setReportOpen(true),
        },
      ];
    }
    // 타인 게시글: 공유하기 + 신고하기
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
        {
          label: "신고하기",
          onClick: () => setReportOpen(true),
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

    // 자기가 작성한 댓글: 공유하기 + 삭제하기
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
      {showAvatarFallback ? (
        <DefaultProfileIcon
          className="h-9 w-9 rounded-full"
          width={36}
          height={36}
        />
      ) : (
        <img
          src={avatarUrl}
          alt={userName ?? "프로필"}
          className="h-9 w-9 rounded-full"
          width={36}
          height={36}
          onError={() => setErroredSrc(avatarUrl ?? null)}
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

      {/* 신고 사유 선택 시트 */}
      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        isSubmitting={isReporting}
        onSubmit={(reason) =>
          report({
            targetType: isPost ? "POST" : "COMMENT",
            targetId: objectId,
            reason,
          })
        }
      />

      {/* 신고 완료 토스트 */}
      {reportedToast &&
        createPortal(
          <div className="fixed bottom-[2rem] left-1/2 z-[9999] -translate-x-1/2">
            <ToastItem
              message={`${isPost ? "게시글" : "댓글"} 신고가 완료되었습니다.`}
              icon={<CheckCircleIcon className="h-5 w-5" />}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
