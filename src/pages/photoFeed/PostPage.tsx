import {
  HomeIcon,
  CheckCircleIcon,
  HeartIcon,
  HeartFillIcon,
  ChatBubbleEmptyIcon,
} from "@/assets/icon";
import { Header, ToastItem } from "@/components/common";
import { postSelfMock } from "@/types/photoFeed/post";
import { commentMock } from "@/types/photoFeed/comment";
import { timeAgo } from "@/utils/timeAgo";
import PhotoCarousel from "@/components/photoFeed/PhotoCarousel";
import { useEffect, useState } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import Profile from "@/components/photoFeed/Profile";
import { useNavigate } from "react-router";
import CommentInput from "@/components/photoFeed/CommentInput";

export default function PostPage() {
  const mock = postSelfMock;
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
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] pt-[1rem]">
      {/** TODO: 상황별로 다른 곳으로 navigate 되어야 함  */}
      <Header title="" showBack onBack={() => navigate("/photoFeed")} />
      <section className="flex flex-col gap-[0.625rem] pb-10">
        {/** 상단 */}
        <div className="flex flex-col gap-[0.625rem]">
          <Profile
            type="post"
            userName={mock.user?.username}
            avatarUrl={mock.user?.avatarUrl}
            date={mock.date}
            isOwner={true}
          />
          <PhotoCarousel images={mock.photoUrl} altPrefix={mock.title} />
          <div className="flex h-5 w-full justify-start gap-3 pl-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="좋아요"
                aria-pressed={isLiked}
                onClick={() => setIsLiked((prev) => !prev)}
              >
                {isLiked ? (
                  <HeartFillIcon className="h-[1.25rem] w-[1.40625rem] text-orange-500" />
                ) : (
                  <HeartIcon className="h-[1.25rem] w-[1.40625rem] text-white/80" />
                )}
              </button>
              <p className="text-[0.8125rem]">{mock.likes}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="댓글 보기"
                onClick={() => {
                  setCommentVisible(true);
                }}
              >
                <ChatBubbleEmptyIcon className="h-[1.25rem] w-[1.25rem]" />
              </button>
              <p className="text-[0.8125rem]">{mock.comments}</p>
            </div>
          </div>
        </div>

        {/** 하단 */}
        <div className="flex flex-col gap-4">
          {/** 게시글 제목 및 내용 */}
          <div className="flex flex-col gap-2">
            <p className="text-semi-bold text-[1.0625rem] text-neutral-100">
              {mock.title}
            </p>
            <p className="text-[0.9375rem] text-neutral-300">{mock.content}</p>
          </div>

          {/** 현상소 후기 */}
          <button
            type="button"
            aria-label="현상소 보러가기"
            onClick={() => navigate("/photoFeed/lab/review")} // TODO: PL-020으로 이동
            className="bg-neutral-875 flex flex-col gap-2 rounded-2xl p-[1.25rem] text-left text-neutral-500"
          >
            {mock.isSelfProcessed ? (
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 font-semibold" />
                <p className="text-[1rem] font-semibold text-neutral-200">
                  자가 현상했어요
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4 font-semibold" />
                  <p className="text-[1rem] font-semibold text-neutral-200">
                    {mock.lab.name} 이용
                  </p>
                </div>
                <p className="text-[0.875rem] text-neutral-200">
                  {mock.lab.review}
                </p>
              </div>
            )}
          </button>
        </div>
      </section>

      {/** toast 메세지 */}
      {/** TODO: 게시글 작성 직후에만 뜨도록 변경 예정 */}
      {mounted && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-5 py-5">
          <div
            className={`transition-opacity duration-300 ease-out ${
              toastVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ToastItem
              message="게시글이 성공적으로 업로드 되었어요 :)"
              icon={<CheckCircleIcon className="h-5 w-5" />}
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
          <div className="flex h-full flex-col gap-1">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-5">
                {commentMock.map(({ id, user, content, createdAt }) => (
                  <Profile
                    key={id}
                    type="comment"
                    userName={user?.username}
                    avatarUrl={user?.avatarUrl}
                    comment={content}
                    time={timeAgo(createdAt)}
                    isOwner={mock.user?.id === user?.id}
                  />
                ))}
              </div>
            </div>
            <div className="bg-neutral-875 h-10 shrink-0">
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
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/**
 * CO-030 PostPage.tsx
 * Description: 게시물 상세보기 페이지
 */
