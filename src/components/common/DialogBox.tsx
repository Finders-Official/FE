import React from "react";

type TextAlign = "center" | "left";
type ConfirmStyle = "filled" | "text";

interface DialogBoxProps {
  isOpen: boolean; // 모달 표시 여부
  title: string;
  description?: string;

  // 버튼 관련
  confirmText: string; // 확인 버튼 텍스트 (예: 계속 편집, 확인)
  onConfirm: () => void; // 확인 버튼 클릭 함수

  cancelText?: string; // 취소 버튼 텍스트 (없으면 버튼 안 보임. 예: 저장 안 함)
  onCancel?: () => void; // 취소 버튼 클릭 함수 (배경 클릭 시에도 호출됨)

  // 스타일 옵션
  align?: TextAlign;
  confirmButtonStyle?: ConfirmStyle;
}

export const DialogBox = ({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  cancelText,
  onCancel,
  align = "center",
  confirmButtonStyle = "filled",
}: DialogBoxProps) => {
  if (!isOpen) return null;

  const borderGradient =
    "linear-gradient(139.21deg, rgba(172, 157, 157, 0.215) 0%, rgba(255, 255, 255, 0.5) 120.67%)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[0.125rem]">
      <div className="absolute inset-0" onClick={onCancel} />

      <div className="relative w-[20rem] rounded-[1.25rem] border border-[#3D3D3D] bg-[#1C1C1C] px-6 py-8">
        <div
          className={`mb-8 flex flex-col gap-2 ${align === "center" ? "text-center" : "text-left"}`}
        >
          <h2 className="text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-line text-[#F0F0F0]">
            {title}
          </h2>
          {description && (
            <p className="font-regular text-[0.875rem] leading-[155%] tracking-[-0.02em] whitespace-pre-line text-[#D6D6D6]">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-end"}`}
        >
          {/* 취소 버튼 */}
          {cancelText && (
            <button
              onClick={onCancel}
              className="h-[3rem] flex-1 rounded-[0.75rem] text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-[#D6D6D6] transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: `linear-gradient(#1C1C1C, #1C1C1C) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {cancelText}
            </button>
          )}

          {/* 확인 버튼 */}
          {confirmButtonStyle === "filled" ? (
            <button
              onClick={onConfirm}
              className={`${cancelText ? "flex-1" : "w-full"} h-[3rem] rounded-[0.75rem] text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-[#F0F0F0] transition-all hover:brightness-110 active:scale-[0.98]`}
              style={{
                background: `linear-gradient(#E94E16, #E94E16) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {confirmText}
            </button>
          ) : (
            // 텍스트형 버튼
            <button
              onClick={onConfirm}
              className="font-regular px-2 py-1 text-[0.875rem] leading-[155%] text-[#E94E16] transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
