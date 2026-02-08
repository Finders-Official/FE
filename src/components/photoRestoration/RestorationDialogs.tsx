import React from "react";
import { DialogBox } from "@/components/common/DialogBox";
import type { Dispatch, SetStateAction } from "react";

type DialogType =
  | "NONE"
  | "MASKING_BACK"
  | "SERVER_ERROR"
  | "REGENERATE_CONFIRM"
  | "DISCARD_CONFIRM"
  | "NO_MASK"
  | "NO_CREDIT";

interface RestorationDialogsProps {
  activeDialog: DialogType;
  setActiveDialog: Dispatch<SetStateAction<DialogType>>;
  handleDialogConfirm: () => void;
  handleDialogCancel: () => void;
  setError: Dispatch<SetStateAction<string | null>>;
  resetRestoration: () => void;
}

export const RestorationDialogs: React.FC<RestorationDialogsProps> = ({
  activeDialog,
  // setActiveDialog, // 부모 핸들러가 처리하므로 직접 사용 안 함
  handleDialogConfirm,
  handleDialogCancel,
  // setError, // 부모 핸들러가 처리
  // resetRestoration, // 부모 핸들러가 처리
}) => {
  return (
    <>
      {/* 뒤로가기 경고 (MASKING_BACK) */}
      <DialogBox
        isOpen={activeDialog === "MASKING_BACK"}
        title="아직 사진을 다듬고 있어요"
        description="지금 나가면 작업한 내용이 사라져요."
        cancelText="저장 안 함"
        // '저장 안 함' -> 나가기(Navigate -1) -> 부모의 Confirm 로직
        onCancel={handleDialogConfirm}
        confirmText="계속 편집"
        // '계속 편집' -> 다이얼로그 닫기 -> 부모의 Cancel 로직
        onConfirm={handleDialogCancel}
        confirmButtonStyle="filled"
      />

      {/* 서버 에러 (SERVER_ERROR) */}
      <DialogBox
        isOpen={activeDialog === "SERVER_ERROR"}
        title="서버 연결이 불안정합니다"
        description="잠시 후 다시 시도해주세요."
        align="left"
        confirmButtonStyle="text"
        confirmText="확인"
        onConfirm={handleDialogConfirm}
      />

      {/* 마스크 없음 경고 (NO_MASK) */}
      <DialogBox
        isOpen={activeDialog === "NO_MASK"}
        title="영역을 선택해주세요"
        description="복원할 부분을 색칠해야 합니다."
        confirmText="확인"
        onConfirm={handleDialogConfirm}
      />

      {/* 크레딧 부족 */}
      <DialogBox
        isOpen={activeDialog === "NO_CREDIT"}
        title="크레딧을 모두 사용하셨어요!"
        description="오늘 밤 12시가 넘으면 자동 충전되니, \n조금만 기다려주세요 :)"
        align="left"
        confirmButtonStyle="text"
        confirmText="확인"
        onConfirm={handleDialogConfirm}
      />

      {/* 다시 생성 확인 (REGENERATE_CONFIRM) */}
      <DialogBox
        isOpen={activeDialog === "REGENERATE_CONFIRM"}
        title="복원을 한 번 더 진행할까요?"
        description="기존에 생성된 이미지는 저장되지 않습니다."
        confirmText="다시 하기"
        cancelText="취소"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />

      {/* 결과 폐기 확인 (DISCARD_CONFIRM) */}
      <DialogBox
        isOpen={activeDialog === "DISCARD_CONFIRM"}
        title="생성된 이미지를 폐기할까요?"
        description="이 페이지를 벗어나면 복원된 사진이 삭제됩니다."
        confirmText="폐기하기"
        cancelText="취소"
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
        confirmButtonStyle="text"
      />
    </>
  );
};
