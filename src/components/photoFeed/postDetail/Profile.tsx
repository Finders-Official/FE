import {
  CheckCircleIcon,
  DefaultProfileIcon,
  EllipsisVerticalIcon,
} from "@/assets/icon";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ActionSheet, { type ActionSheetAction } from "./ActionSheet";
import ReportSheet from "./ReportSheet";
import { Toast } from "@/components/common";
import { timeAgo } from "@/utils/timeAgo";
import {
  useDeletePost,
  useDeleteComment,
  useReportContent,
} from "@/hooks/photoFeed";
import { useLocation, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { Press } from "@/components/common/motion";

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

type ShareResult = "shared" | "copied" | "cancelled" | "failed";

async function shareCurrentUrl(): Promise<ShareResult> {
  const url = window.location.href;

  // 네이티브/모바일: OS 공유 시트 (시트 자체가 피드백)
  if (navigator.share) {
    try {
      await navigator.share({ title: "파인더스", text: "게시글 공유", url });
      return "shared";
    } catch (e) {
      // 사용자가 공유 시트를 닫으면 AbortError → 조용히 무시
      return e instanceof Error && e.name === "AbortError"
        ? "cancelled"
        : "failed";
    }
  }

  // 데스크톱 등 Web Share 미지원: 클립보드 복사 (호출부에서 토스트로 피드백)
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
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

  // 신고 사유 선택 시트 + 공용 토스트(신고 완료 / 링크 복사 등)
  const [reportOpen, setReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { mutate: report, isPending: isReporting } = useReportContent({
    onSuccess: () => {
      setReportOpen(false);
      setToastMessage(
        `${type === "post" ? "게시글" : "댓글"} 신고가 완료되었습니다.`,
      );
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

  // 공유하기: 공유 시트(모바일) 또는 클립보드 복사(데스크톱). 복사 시 토스트로 안내.
  const handleShare = useCallback(async () => {
    const result = await shareCurrentUrl();
    if (result === "copied") {
      setToastMessage("링크가 복사되었습니다.");
    }
    setMoreMenu(false);
  }, []);

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
    // 타인 댓글: 공유하기 + 신고하기
    if (isComment && !isOwner) {
      return [
        { label: "공유하기", onClick: handleShare },
        { label: "신고하기", onClick: () => setReportOpen(true) },
      ];
    }
    // 타인 게시글: 공유하기 + 신고하기
    if (isPost && !isOwner) {
      return [
        { label: "공유하기", onClick: handleShare },
        { label: "신고하기", onClick: () => setReportOpen(true) },
      ];
    }
    // 내 게시글: 공유하기 + 삭제하기
    if (isPost && isOwner) {
      return [
        { label: "공유하기", onClick: handleShare },
        {
          label: "삭제하기",
          disabled: isPostPending,
          variant: "danger",
          onClick: handleDeletePost,
        },
      ];
    }
    // 내 댓글: 공유하기 + 삭제하기
    return [
      { label: "공유하기", onClick: handleShare },
      {
        label: "삭제하기",
        disabled: isCommentPending,
        variant: "danger",
        onClick: handleDeleteComment,
      },
    ];
  }, [
    handleShare,
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
        <Press
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="더보기"
          onClick={() => setMoreMenu(true)}
        >
          <EllipsisVerticalIcon className="h-4 w-[3px]" />
        </Press>
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

      {/* 공용 토스트 (신고 완료 / 링크 복사 등) */}
      {createPortal(
        <Toast
          open={Boolean(toastMessage)}
          onClose={() => setToastMessage(null)}
          duration={3000}
          message={toastMessage ?? ""}
          icon={<CheckCircleIcon className="h-5 w-5" />}
        />,
        document.body,
      )}
    </div>
  );
}
