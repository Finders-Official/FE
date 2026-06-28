import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Press } from "@/components/common/motion";
import { useReveal, useDismiss } from "@/transitions";

type TextAlign = "center" | "left";
type ConfirmStyle = "filled" | "text";

interface DialogBoxProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
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
  children,
  confirmText,
  onConfirm,
  cancelText,
  onCancel,
  align = "center",
  confirmButtonStyle = "filled",
}: DialogBoxProps) => {
  const { mounted, state, ref, getRevealProps } = useReveal(isOpen, {
    variant: "modal",
  });
  useDismiss(ref, () => onCancel?.(), isOpen);

  if (!mounted || typeof document === "undefined") return null;

  const borderGradient =
    "linear-gradient(139.21deg, rgba(172, 157, 157, 0.215) 0%, rgba(255, 255, 255, 0.5) 120.67%)";

  const modalContent = (
    <div
      className={`ease-smooth-out fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[0.125rem] transition-opacity ${
        state === "closing"
          ? "duration-[var(--duration-quick)]"
          : "duration-[var(--duration-fast)]"
      }`}
      style={{ opacity: state === "open" ? 1 : 0 }}
    >
      <div
        {...getRevealProps({
          className:
            "bg-neutral-875/70 relative w-[20rem] rounded-[1.25rem] border border-neutral-800 px-6 py-8",
        })}
      >
        {children ? (
          <div className="mb-6 max-h-[60vh] overflow-y-auto">{children}</div>
        ) : (
          <div
            className={`mb-8 flex flex-col gap-2 ${align === "center" ? "text-center" : "text-left"}`}
          >
            {title && (
              <h2 className="text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-line text-neutral-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-regular text-[0.875rem] leading-[155%] tracking-[-0.02em] whitespace-pre-line text-neutral-200">
                {description.replaceAll("\\n", "\n")}
              </p>
            )}
          </div>
        )}

        <div
          className={`flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-end"}`}
        >
          {cancelText && (
            <Press
              onClick={onCancel}
              className="h-12 flex-1 rounded-xl text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200 hover:brightness-110"
              style={{
                background: `linear-gradient(#1C1C1C, #1C1C1C) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {cancelText}
            </Press>
          )}

          {confirmButtonStyle === "filled" ? (
            <Press
              onClick={onConfirm}
              className={`${cancelText ? "flex-1" : "w-full"} h-12 rounded-xl text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100 hover:brightness-110`}
              style={{
                background: `linear-gradient(#E94E16, #E94E16) padding-box, ${borderGradient} border-box`,
                border: "1px solid transparent",
              }}
            >
              {confirmText}
            </Press>
          ) : (
            <Press
              onClick={onConfirm}
              className="font-regular px-2 py-1 text-[0.875rem] leading-[155%] text-orange-500"
            >
              {confirmText}
            </Press>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
