import { useState, useRef, useCallback } from "react";
import { CopyIcon, CopyFillIcon } from "@/assets/icon";
import { ToastItem } from "./ToastMessage";

interface CopyButtonProps {
  text: string;
  toastMessage?: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  aboveTabBar?: boolean;
}

export function CopyButton({
  text,
  toastMessage = "클립보드에 복사되었습니다.",
  className,
  iconClassName = "h-4 w-4 text-neutral-200",
  children,
  ariaLabel,
  aboveTabBar = false,
}: CopyButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);

      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);

      setMounted(true);
      setVisible(true);

      fadeTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        fadeTimeoutRef.current = null;
      }, 1800);

      removeTimeoutRef.current = setTimeout(() => {
        setMounted(false);
        removeTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  }, [text]);

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={className}
        aria-label={ariaLabel}
      >
        {children ?? <CopyIcon className={iconClassName} />}
      </button>

      {mounted && (
        <div
          className={`fixed left-1/2 z-[9999] flex -translate-x-1/2 flex-col gap-[0.75rem] ${aboveTabBar ? "bottom-[calc(var(--tabbar-height)+1rem)]" : "bottom-[2rem]"}`}
        >
          <div className={visible ? "" : "animate-toast-out"}>
            <ToastItem
              message={toastMessage}
              icon={<CopyFillIcon className="h-5 w-5 text-orange-500" />}
            />
          </div>
        </div>
      )}
    </>
  );
}
