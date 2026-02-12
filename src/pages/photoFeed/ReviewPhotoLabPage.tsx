import { useRef, useState } from "react";
import { CTA_Button } from "@/components/common/CTA_Button";
import { HomeIcon, ExclamationCircleIcon } from "@/assets/icon";
import { TextArea } from "@/components/common/TextArea";
import { DialogBox } from "@/components/common/DialogBox";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import { useNewPostState } from "@/store/useNewPostState.store";
import { useAuthStore } from "@/store/useAuth.store";
import { useCreatePostWithUpload } from "@/hooks/photoFeed";
import { scrollToCenter } from "@/utils/scrollToCenter";

const MIN = 20;
const MAX = 300;

export default function ReviewPhotoLabPage() {
  const navigate = useNavigate();

  const [reviewTextError, setReviewTextError] = useState(false);
  const reviewTextRef = useRef<HTMLTextAreaElement | null>(null);

  const [reviewText, setReviewText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 이전 페이지에서 작성한 데이터 가져오기
  const title = useNewPostState((s) => s.title);
  const content = useNewPostState((s) => s.content);

  const files = useNewPostState((s) => s.files);
  const imageMetas = useNewPostState((s) => s.imageMetas);

  const labId = useNewPostState((s) => s.labInfo?.labId);
  const labName = useNewPostState((s) => s.labInfo?.name);

  const isSelfDeveloped = useNewPostState((s) => s.isSelfDeveloped);

  // 게시글 등록한 직후인지에 대한 정보 저장
  const setIsNewPost = useNewPostState((s) => s.setIsNewPost);

  // store 전체 reset
  const reset = useNewPostState((s) => s.reset);

  // 사용자 ID 가져오기
  const memberId = useAuthStore((s) => s.user?.memberId);

  // 리뷰 글자수 제한 적용
  const isTooShort = reviewText.length > 0 && reviewText.length < MIN;
  const isTooLong = reviewText.length > MAX;
  const canSave = reviewText.length === 0 ? false : !isTooShort && !isTooLong;

  // 사진 GCS에 등록 + 게시글 등록
  const { submit, isPending } = useCreatePostWithUpload({
    onSuccess: (postId) => {
      reset();
      setIsNewPost(true);
      navigate(`/photoFeed/post/${postId}`);
    },
    onError: (err) => console.error("게시글 생성 실패", err),
  });

  const handleTextArea = () => {
    if (!canSave) {
      setReviewTextError(true);

      // 스크롤 + 포커스
      const el = reviewTextRef.current;
      if (el) {
        scrollToCenter(el);
        el.focus();
      }
      return;
    }
    setReviewTextError(false);
    setIsDialogOpen(true);
  };

  // 게시글 업로드 핸들러
  const handleSubmit = async () => {
    try {
      await submit({
        title,
        content,
        files,
        imageMetas,
        memberId,
        labId,
        isSelfDeveloped,
        reviewContent: reviewText,
      });
    } catch (e) {
      console.error("게시글 업로드 실패", e); // TODO 디자인 받고 토스트 메세지로 변경
    }
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <Header title="현상소 리뷰 작성" showBack onBack={() => navigate(-1)} />
      <section className="flex flex-col gap-6 pt-10 pb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-left text-[1.375rem] font-semibold text-white">
            이 현상소, 어떤 기억으로 남았나요?
          </h1>
          <div className="flex items-center justify-start gap-2">
            <HomeIcon className="h-[0.875rem] w-[0.75rem]" />
            <p className="text-sm text-neutral-200">{labName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <TextArea
            ref={reviewTextRef}
            value={reviewText}
            onChange={(v) => {
              setReviewText(v);
              if (reviewTextError && canSave) {
                setReviewTextError(false);
              }
            }}
            placeholder={
              "ex) 따뜻하고 포근한 느낌이에요.\nex) 후지필름의 청량함이 잘 느껴져요."
            }
            maxLength={MAX}
            minLength={MIN}
            isError={reviewTextError}
          />
          {reviewTextError && (
            <p
              className={`px-[0.625rem] text-[0.875rem] font-normal text-orange-500`}
            >
              최소 20글자 이상 입력해주세요.
            </p>
          )}
        </div>

        <div className="bg-neutral-875 flex justify-center gap-2 rounded-2xl p-[1.25rem] text-neutral-500">
          <ExclamationCircleIcon className="h-[1.25rem] w-[1.25rem]" />
          <p className="text-[0.75rem]">
            서로를 존중하는 표현으로 남겨주세요. 부적절한 내용은 별도 안내 없이
            삭제될 수 있어요.
          </p>
        </div>

        <div className="fixed right-0 bottom-0 left-0 flex justify-center px-5 py-5">
          <CTA_Button
            text="작성 완료"
            size="xlarge"
            disabled={isPending}
            color={canSave ? "orange" : "black"}
            onClick={handleTextArea}
          />
        </div>

        {isDialogOpen && (
          <DialogBox
            isOpen={isDialogOpen}
            title="이 리뷰를 등록할까요?"
            description="등록하면 이 리뷰가 사진수다에 공유돼요"
            confirmText="네"
            onConfirm={() => {
              setIsDialogOpen(false);
              handleSubmit();
            }}
            cancelText="아니오"
            onCancel={() => setIsDialogOpen(false)}
          />
        )}
      </section>
    </div>
  );
}

/**
 * CO-025 ReviewPhotoLabPage.tsx
 * Description: 현상소 리뷰 작성 페이지
 */
