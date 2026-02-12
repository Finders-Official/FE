import {
  HomeIcon,
  CheckCircleIcon,
  HeartIcon,
  HeartFillIcon,
  ChatBubbleEmptyIcon,
} from "@/assets/icon";
import { Header, ToastItem } from "@/components/common";
import PhotoCarousel from "@/components/photoFeed/postDetail/PhotoCarousel";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { usePostDetail, useUnlikePost, useLikePost } from "@/hooks/photoFeed";
import Profile from "@/components/photoFeed/postDetail/Profile";
import EmptyView from "@/components/common/EmptyView";
import CommentSheet from "@/components/photoFeed/postDetail/CommentSheet";
import { useNewPostState } from "@/store/useNewPostState.store";
import ProfileSkeleton from "@/components/photoFeed/postDetail/ProfileSkeleton";

export default function PostPage() {
  const [commentVisible, setCommentVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 게시글 Id 가져오기
  const { postId } = useParams<{ postId: string }>();
  const numericPostId = Number(postId);

  useEffect(() => {
    if (!postId || Number.isNaN(numericPostId)) {
      navigate("/photoFeed", { replace: true });
    }
  }, [postId, numericPostId, navigate]);

  useEffect(() => {
    if (location.state?.openCommentSheet) {
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // 게시글 상세 정보 조회
  const {
    data: postDetail,
    isPending: isPostPending,
    isError: isPostError,
  } = usePostDetail(numericPostId);

  // 게시글 좋아요
  const { mutate: unlikePost, isPending: isUnliking } = useUnlikePost();
  const { mutate: likePost, isPending: isLiking } = useLikePost();

  const isMutating = isLiking || isUnliking;

  // 게시글 등록 직후인지 여부
  const isNewPost = useNewPostState((s) => s.isNewPost);

  const [toastVisible, setToastVisible] = useState(isNewPost);
  const [mounted, setMounted] = useState(isNewPost);

  // 게시글 등록한 직후인지에 대한 정보 저장
  const setIsNewPost = useNewPostState((s) => s.setIsNewPost);

  useEffect(() => {
    if (!isNewPost) return;

    const fadeTimer = setTimeout(() => setToastVisible(false), 1600);
    const removeTimer = setTimeout(() => setMounted(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [isNewPost]);

  const handleGoBack = () => {
    if (isNewPost) {
      setIsNewPost(false);
      return navigate("/photoFeed");
    }
    // 히스토리 없으면 fallback
    if (window.history.length > 1) return navigate(-1);
    return navigate("/photoFeed");
  };

  const renderPostDetail = () => {
    if (isPostPending) {
      return (
        <>
          <div className="flex animate-pulse flex-col gap-[0.625rem] pb-10">
            <Header title="" showBack onBack={handleGoBack} />
            <ProfileSkeleton />
            <div className="h-90 w-full bg-neutral-700"></div>
            <p className="h-4 w-70 rounded-xl bg-neutral-800"></p>
            <p className="h-4 w-50 rounded-xl bg-neutral-800"></p>
          </div>
        </>
      );
    }
    if (isPostError)
      return (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <p className="text-red-400">불러오기에 실패했어요.</p>
        </div>
      );
    if (!postDetail) return <EmptyView content="게시글 정보가 없습니다." />;
    return (
      <>
        <Header title="" showBack onBack={handleGoBack} />
        <section className="flex flex-col gap-[0.625rem] pb-10">
          {/** 상단 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-[0.625rem]">
              <Profile
                type="post"
                userName={postDetail.nickname}
                avatarUrl={postDetail.profileImageUrl}
                date={postDetail.createdAt}
                isOwner={postDetail.isMine}
                objectId={postDetail.postId}
              />
              <PhotoCarousel
                images={postDetail.images}
                altPrefix={postDetail.title}
              />
            </div>

            <div className="flex h-5 w-full justify-start gap-3 pl-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={isMutating}
                  aria-label="좋아요"
                  aria-pressed={postDetail.isLiked}
                  onClick={() => {
                    if (isMutating) return;

                    if (postDetail.isLiked) unlikePost(postDetail.postId);
                    else likePost(postDetail.postId);
                  }}
                >
                  {postDetail.isLiked ? (
                    <HeartFillIcon className="h-[1.25rem] w-[1.40625rem] text-orange-500" />
                  ) : (
                    <HeartIcon className="h-[1.25rem] w-[1.40625rem] text-white/80" />
                  )}
                </button>
                <p className="text-[0.8125rem]">{postDetail.likeCount}</p>
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
                <p className="text-[0.8125rem]">{postDetail.commentCount}</p>
              </div>
            </div>
          </div>

          {/** 하단 */}
          <div className="flex flex-col gap-4">
            {/** 게시글 제목 및 내용 */}
            <div className="flex flex-col gap-1">
              <p className="text-semi-bold text-[1.0625rem] text-neutral-100">
                {postDetail.title}
              </p>
              <p className="text-[0.9375rem] text-neutral-300">
                {postDetail.content}
              </p>
            </div>

            {/** 현상소 후기 */}
            {postDetail.isSelfDeveloped ? (
              <div className="border-neutral-850 flex items-center gap-2 rounded-2xl border bg-neutral-900 px-5 py-4 text-left text-neutral-500">
                <HomeIcon className="h-4 w-4 font-semibold" />
                <p className="font-regular text-[1rem] text-neutral-400">
                  자가 현상했어요
                </p>
              </div>
            ) : (
              <button
                type="button"
                aria-label="현상소 보러가기"
                onClick={() =>
                  navigate(`/photolab/${postDetail.labReview?.labId}`)
                }
                className="bg-neutral-875 border-neutral-850 flex flex-col gap-1 rounded-2xl border px-5 py-4 text-left text-neutral-500"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4 font-semibold" />
                    <p className="font-Medium text-[1rem] text-neutral-200">
                      {postDetail.labReview?.labName} 이용
                    </p>
                  </div>
                  <p className="text-[0.875rem] text-neutral-200">
                    {postDetail.labReview?.content}
                  </p>
                </div>
              </button>
            )}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem]">
      {renderPostDetail()}

      {/** 게시글 업로드 toast 메세지 */}
      {isNewPost && mounted && (
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

      {/** 댓글창 */}
      {postDetail && (
        <CommentSheet
          open={commentVisible}
          onClose={() => setCommentVisible(false)}
          postId={postDetail.postId}
        />
      )}
    </div>
  );
}

/**
 * CO-030 PostPage.tsx
 * Description: 게시물 상세보기 페이지
 */
