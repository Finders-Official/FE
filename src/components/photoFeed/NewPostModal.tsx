import { Button } from "@/components/common/Button";
import XIcon from "@/assets/icon/x.svg?react";
import PencilIcon from "@/assets/icon/pencil.svg?react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPostModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 */}
      <div className="border-neutral-850 h-[358px] w-[314px] rounded-3xl bg-[#222222]/80 pt-7 pr-7 pb-14 pl-7 backdrop-blur-3xl">
        {/* 닫기 버튼 */}
        <section className="mb-2 flex justify-end">
          <button onClick={onClose}>
            <XIcon className="h-[14px] w-[14px]" />
          </button>
        </section>

        <section className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <PencilIcon className="h-[32px] w-[32px]" />
            <h2 className="text-center text-[19px] font-semibold text-white">
              사진수다는 필름 사진만
              <br />
              업로드 할 수 있는 공간이에요
            </h2>
            <p className="text-center text-[13px] text-neutral-200">
              사진수다는 필름 현상소 리뷰 기능도
              <br />
              함께 운영되고 있어요
            </p>
          </div>

          {/* 하단 버튼 */}
          <div className="flex gap-3">
            <Button
              text="다음에 올릴게요"
              size="xsmall"
              color="transparent"
              onClick={onClose}
            />
            <Button
              text="네 확인했어요"
              size="xsmall"
              color="orange"
              onClick={() => {
                // TODO: 다음 단계 로직
                onClose();
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
