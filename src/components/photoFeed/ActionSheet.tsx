import { useEffect } from "react";
import { createPortal } from "react-dom";

type ActionSheetAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

interface ActionSheetProps {
  open: boolean;
  actions: ActionSheetAction[];
  onClose: () => void;
}

export default function ActionSheet({
  open,
  actions,
  onClose,
}: ActionSheetProps) {
  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const ui = (
    <div className="fixed inset-0 z-500">
      {/* backdrop */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* sheet */}
      <div className="absolute inset-x-0 bottom-0 mb-7 gap-4 px-4">
        <div className="bg-neutral-875 overflow-hidden rounded-3xl border border-neutral-800">
          <div className="divide-y divide-white/10">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => {
                  a.onClick();
                  onClose();
                }}
                className={`w-full py-4 text-center text-[15px] ${
                  a.variant === "danger" ? "text-red-400" : "text-neutral-100"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="bg-neutral-875 my-4 w-full rounded-3xl border border-neutral-800 py-4 text-center text-[15px] text-neutral-100"
        >
          취소
        </button>
      </div>
    </div>
  );

  return createPortal(ui, document.body); // 무조건 body에 렌더링
}
