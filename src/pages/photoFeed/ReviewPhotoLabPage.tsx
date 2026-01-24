import { useState } from "react";
import { CTA_Button } from "@/components/common/CTA_Button";
import { HomeIcon, ExclamationCircleIcon } from "@/assets/icon";
import { TextArea } from "@/components/common/TextArea";
import { DialogBox } from "@/components/common/DialogBox";
import { useNavigate, useLocation } from "react-router";
import { Header } from "@/components/common";
import { useMutation } from "@tanstack/react-query";
import type { PostRequest } from "@/types/photoFeed/post";
import { createPost } from "@/apis/photoFeed/post.api";

export default function ReviewPhotoLabPage() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const labName = state?.labName;
  const labId = state?.labId;
  const files = state?.files;
  const title = state?.title;
  const content = state?.content;

  const [reviewText, setReviewText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const MIN = 20;
  const MAX = 300;

  const isTooShort = reviewText.length > 0 && reviewText.length < MIN;
  const isTooLong = reviewText.length > MAX;
  const canSave = reviewText.length === 0 ? false : !isTooShort && !isTooLong;

  const createMutation = useMutation({
    mutationFn: (payload: PostRequest) => createPost(payload),
    onSuccess: (data) => {
      // 성공 시 생성된 게시글로 이동
      navigate(`/photoFeed/post/${data}`);
    },
    onError: () => {
      // TODO: 토스트/다이얼로그로 에러 안내
      alert("리뷰 등록에 실패했어요. 다시 시도해주세요.");
    },
  });

  const handleSubmit = () => {
    const payload: PostRequest = {
      title: title,
      content: content,
      image: files,
      isSelfDeveloped: false,
      labId: labId,
      reviewContent: reviewText,
    };

    createMutation.mutate(payload);
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

        <TextArea
          value={reviewText}
          onChange={setReviewText}
          placeholder={
            "ex) 따뜻하고 포근한 느낌이에요.\nex) 후지필름의 청량함이 잘 느껴져요."
          }
          maxLength={MAX}
          minLength={MIN}
        />

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
            disabled={!canSave}
            color={canSave ? "orange" : "black"}
            onClick={() => setIsDialogOpen(true)}
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
