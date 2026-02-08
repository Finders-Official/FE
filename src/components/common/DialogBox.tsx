import { createPortal } from "react-dom";

type TextAlign = "center" | "left";
type ConfirmStyle = "filled" | "text";

interface DialogBoxProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel?: () => void;
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
  if (!isOpen || typeof document === "undefined") return null;

  const borderGradient =
    "linear-gradient(139.21deg, rgba(172, 157, 157, 0.215) 0%, rgba(255, 255, 255, 0.5) 120.67%)";

  const modalContent = (
    <div
      // 1. 배경(Wrapper)에 직접 onClick 이벤트 할당
      onClick={onCancel}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[0.125rem]"
    >
      <div
        // 2. 모달 내부 클릭 시 상위(배경)로 클릭 이벤트가 전파되지 않도록 차단
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-875/70 relative w-[20rem] rounded-[1.25rem] border border-neutral-800 px-6 py-8"
      >
        <div
          className={`mb-8 flex flex-col gap-2 ${align === "center" ? "text-center" : "text-left"}`}
        >
          <h2 className="text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-line text-neutral-100">
            {title}
          </h2>
          {description && (
            <p className="font-regular text-[0.875rem] leading-[155%] tracking-[-0.02em] whitespace-pre-line text-neutral-200">
              {description.replaceAll("\\n", "\n")}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-end"}`}
        >
          {cancelText && (
            <button
              onClick={onCancel}
              className="h-12 flex-1 rounded-xl text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200 transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: `linear-gradient(#1C1C1C, #1C1C1C) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {cancelText}
            </button>
          )}

          {confirmButtonStyle === "filled" ? (
            <button
              onClick={onConfirm}
              className={`${cancelText ? "flex-1" : "w-full"} h-12 rounded-xl text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100 transition-all hover:brightness-110 active:scale-[0.98]`}
              style={{
                background: `linear-gradient(#E94E16, #E94E16) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {confirmText}
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="font-regular px-2 py-1 text-[0.875rem] leading-[155%] text-orange-500 transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
