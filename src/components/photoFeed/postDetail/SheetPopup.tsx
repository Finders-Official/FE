import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useReveal } from "@/transitions";

interface SheetPopupProps {
  open: boolean;
  onClose: () => void;
  /** 상단 둥근 리스트 영역에 들어갈 항목들 (divide-y로 구분됨) */
  children: ReactNode;
  /** 리스트 아래 별도 버튼 (취소 / 신고하기 등) */
  footer?: ReactNode;
}

/**
 * 하단에서 올라오는 팝업 시트의 공용 레이아웃.
 * ActionSheet(공유/삭제/신고 메뉴)와 ReportSheet(신고 사유 선택)가 동일 UI로 재사용한다.
 */
export default function SheetPopup({
  open,
  onClose,
  children,
  footer,
}: SheetPopupProps) {
  const { mounted, state, getRevealProps } = useReveal(open, {
    variant: "sheet-bottom",
  });

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-500">
      {/* backdrop */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={`ease-smooth-out absolute inset-0 bg-black/60 transition-opacity ${
          state === "closing"
            ? "duration-[var(--duration-medium)]"
            : "duration-[var(--duration-slow)]"
        }`}
        style={{ opacity: state === "open" ? 1 : 0 }}
      />

      {/* sheet */}
      <div
        {...getRevealProps({
          className: "absolute inset-x-0 bottom-0 gap-4 px-4",
        })}
      >
        <div className="bg-neutral-875 overflow-hidden rounded-3xl border border-neutral-800">
          <div className="divide-y divide-white/10">{children}</div>
        </div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}
