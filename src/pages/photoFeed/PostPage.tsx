import {
  HomeIcon,
  CheckCircleIcon,
  HeartIcon,
  HeartFillIcon,
  ChatBubbleEmptyIcon,
} from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { postMock } from "@/types/post";
import { commentMock } from "@/types/comment";
import { timeAgo } from "@/utils/timeAgo";
import PhotoCarousel from "@/components/photoFeed/PhotoCarousel";
import { useEffect, useState } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import Profile from "@/components/photoFeed/Profile";
import { useNavigate } from "react-router";
import CommentInput from "@/components/photoFeed/CommentInput";

export default function PostPage() {
  const [toastVisible, setToastVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [commentVisible, setCommentVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // 1. 1.6초 후 fade-out 시작
    const fadeTimer = setTimeout(() => {
      setToastVisible(false);
    }, 1600);

    // 2. 3초 후 완전히 제거
    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <section className="flex flex-col gap-[10px] pt-10 pb-10">
        {/** 상단 */}
        <div className="flex flex-col gap-[10px]">
          <Profile
            type="post"
            userName={postMock.user?.username}
            avatarUrl={postMock.user?.avatarUrl}
            date={postMock.date}
            isOwner={true}
          />
          <PhotoCarousel
            images={postMock.photoUrl}
            altPrefix={postMock.title}
          />
          <div className="flex h-5 w-full justify-start gap-3 pl-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="좋아요"
                aria-pressed={isLiked}
                onClick={() => setIsLiked((prev) => !prev)}
              >
                {isLiked ? (
                  <HeartFillIcon className="h-[20px] w-[22.5px] text-orange-500" />
                ) : (
                  <HeartIcon className="h-[20px] w-[22.5px] text-white/80" />
                )}
              </button>
              <p className="text-[13px]">{postMock.likes}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="댓글 보기"
                onClick={() => {
                  setCommentVisible(true);
                }}
              >
                <ChatBubbleEmptyIcon className="h-[20px] w-[20px]" />
              </button>
              <p className="text-[13px]">{postMock.comments}</p>
            </div>
          </div>
        </div>

        {/** 하단 */}
        <div className="flex flex-col gap-4">
          {/** 게시글 제목 및 내용 */}
          <div className="flex flex-col gap-2">
            <p className="text-semi-bold text-[17px] text-neutral-100">
              {postMock.title}
            </p>
            <p className="text-[15px] text-neutral-300">{postMock.content}</p>
          </div>

          {/** 현상소 후기 */}
          <button
            type="button"
            aria-label="현상소 보러가기"
            onClick={() => navigate("/photoFeed/lab/review")} // TODO: PL-020으로 이동
            className="bg-neutral-875 flex flex-col gap-2 rounded-2xl p-[1.25rem] text-left text-neutral-500"
          >
            <div className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4 font-semibold" />
              <p className="text-[16px] font-semibold text-neutral-200">
                {postMock.lab.name} 이용
              </p>
            </div>
            <p className="text-[14px] text-neutral-200">
              {postMock.lab.review}
            </p>
          </button>
        </div>
      </section>

      {/** toast 메세지 */}
      {mounted && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-5 py-5">
          <div
            className={`transition-opacity duration-300 ease-out ${
              toastVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ToastItem
              message="게시글이 성공적으로 업로드 되었어요 :)"
              icon={<CheckCircleIcon />}
            />
          </div>
        </div>
      )}

      {/** 댓글창(바텀시트) */}
      {commentVisible && (
        <BottomSheet
          open={commentVisible}
          onClose={() => setCommentVisible(false)}
          title="댓글"
        >
          <div className="mb-4 flex flex-col gap-5">
            {commentMock.map(({ id, user, content, createdAt }) => (
              <Profile
                key={id}
                type="comment"
                userName={user?.username}
                avatarUrl={user?.avatarUrl}
                comment={content}
                time={timeAgo(createdAt)}
                isOwner={postMock.user?.id === user?.id}
              />
            ))}
          </div>
          <CommentInput
            value={comment}
            onChange={setComment}
            onSubmit={() => {
              // API 호출
              // 성공하면 초기화
              setComment("");
            }}
            placeholder="이 현상에 대한 이야기를 남겨보세요!"
          />
        </BottomSheet>
      )}
    </div>
  );
}

/**
 * CO-030 PostPage.tsx
 * Description: 게시물 상세보기 페이지
 */
