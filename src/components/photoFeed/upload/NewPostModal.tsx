import { CTA_Button } from "@/components/common/CTA_Button";
import { PencilLineFillIcon, XMarkIcon } from "@/assets/icon";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useNewPostState } from "@/store/useNewPostState.store";
import { useReveal, useDismiss } from "@/transitions";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPostModal({ isOpen, onClose }: ModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { mounted, state, ref, getRevealProps } = useReveal(isOpen, {
    variant: "modal",
  });
  useDismiss(ref, onClose, isOpen);

  if (!mounted) return null;

  return (
    <div
      className={`ease-smooth-out fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity ${
        state === "closing"
          ? "duration-[var(--duration-quick)]"
          : "duration-[var(--duration-fast)]"
      }`}
      style={{ opacity: state === "open" ? 1 : 0 }}
    >
      <div
        {...getRevealProps({
          className:
            "border-neutral-850 bg-neutral-875/80 h-[22.375rem] w-[19.625rem] rounded-3xl pt-7 pr-7 pb-14 pl-7 backdrop-blur-3xl",
        })}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-modal-title"
      >
        {/* 닫기 버튼 */}
        <div className="mb-2 flex justify-end">
          <button onClick={onClose} aria-label="모달 닫기">
            <XMarkIcon className="h-[0.875rem] w-[0.875rem] text-neutral-200" />
          </button>
        </div>

        <section className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <PencilLineFillIcon className="h-[2rem] w-[2rem]" />
            <h2
              id="new-post-modal-title"
              className="text-center text-[1.1875rem] font-semibold text-white"
            >
              사진수다는 필름 사진만
              <br />
              업로드 할 수 있는 공간이에요
            </h2>
            <p className="text-center text-[0.8125rem] text-neutral-200">
              사진수다는 필름 현상소 리뷰 기능도
              <br />
              함께 운영되고 있어요
            </p>
          </div>

          {/* 사진 파일 선택 */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length === 0) return;

              e.currentTarget.value = ""; // 같은 파일 재선택 대비
              onClose();
              navigate("/photoFeed/post/new");

              await useNewPostState.getState().setFiles(files); // files랑 ImageMeta(width, height) 설정
            }}
          />

          {/* 하단 버튼 */}
          <div className="flex gap-3">
            <CTA_Button
              text="다음에 올릴게요"
              size="xsmall"
              color="transparent"
              onClick={onClose}
            />
            <CTA_Button
              text="네 확인했어요"
              size="xsmall"
              color="orange"
              onClick={() => {
                inputRef.current?.click();
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
