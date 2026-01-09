import { useState } from "react";
import { CTA_Button } from "@/components/common/CTA_Button";
import { HomeIcon, ExclamationCircleIcon } from "@/assets/icon";
import { TextArea } from "@/components/common/TextArea";
import { DialogBox } from "@/components/common/DialogBox";
import { useNavigate, useLocation } from "react-router";

export default function ReviewPhotoLabPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const labName = state?.labName;

  const [text, setText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const MIN = 20;
  const MAX = 300;

  const isTooShort = text.length > 0 && text.length < MIN;
  const isTooLong = text.length > MAX;

  const canSave = text.length === 0 ? false : !isTooShort && !isTooLong;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <section className="flex flex-col gap-6 pt-10 pb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-left text-[1.375rem] font-semibold text-white">
            이 현상소, 어떤 기억으로 남았나요?
          </h1>
          <div className="flex items-center justify-start gap-2">
            <HomeIcon className="h-[14px] w-[12px]" />
            <p className="text-sm text-neutral-200">{labName}</p>
          </div>
        </div>

        <TextArea
          value={text}
          onChange={setText}
          placeholder={
            "ex) 따뜻하고 포근한 느낌이에요.\nex) 후지필름의 청량함이 잘 느껴져요."
          }
          maxLength={MAX}
          minLength={MIN}
        />

        <div className="bg-neutral-875 flex justify-center gap-2 rounded-2xl p-[1.25rem] text-neutral-500">
          <ExclamationCircleIcon className="h-[20px] w-[20px]" />
          <p className="text-[12px]">
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
              navigate("/photoFeed/post/${postId}");
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
