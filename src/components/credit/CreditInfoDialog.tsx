import { DialogBox } from "@/components/common/DialogBox";

interface CreditInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: "크레딧이란?",
    body: "크레딧의 용도 티켓은 파인더스 내 유료 기능을 이용하기 위한 전용 재화입니다. 기능 사용 시 크레딧 1개가 소모됩니다.",
  },
  {
    title: "환불이 불가능해요.",
    body: `"기능 사용 결과가 만족스럽지 않다", "단순 변심" 등의 주관적인 사유로는 티켓이 반환되거나 취소되지 않습니다.`,
  },
  {
    title: "오류 발생 시",
    body: "앱 강제 종료, 서버 접속 장애 등 시스템상의 오류로 인해 결과물을 확인하지 못한 경우, 1:1 문의게시판을 통해 문의할 경우 자동으로 티켓을 복구해 드립니다.",
  },
  {
    title: "크레딧 유효기간",
    body: "구매한 크레딧은 결제일로부터 12개월 이내 사용해야 하며, 기간 초과 시 자동 소멸됩니다. 단, 회원 탈퇴 시 보유한 티켓은 즉시 소멸되며 복구되지 않습니다.",
  },
];

export function CreditInfoDialog({ isOpen, onClose }: CreditInfoDialogProps) {
  return (
    <DialogBox
      isOpen={isOpen}
      confirmText="확인"
      confirmButtonStyle="text"
      align="left"
      onConfirm={onClose}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-4 break-keep">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <p className="text-[0.9375rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-200">
              {section.title}
            </p>
            <p className="text-[0.875rem] leading-[1.55] font-normal tracking-[-0.02em] text-neutral-200">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </DialogBox>
  );
}
