import { useState, useRef, useCallback } from "react";
import { CopyIcon, CopyFillIcon } from "@/assets/icon";
import { ToastItem, ToastList } from "./ToastMessage";

interface CopyButtonProps {
  text: string;
  toastMessage?: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}

export function CopyButton({
  text,
  toastMessage = "클립보드에 복사되었습니다.",
  className,
  iconClassName = "h-4 w-4 text-neutral-200",
  children,
  ariaLabel,
}: CopyButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      setShowToast(true);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
        toastTimeoutRef.current = null;
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

      {showToast && (
        <ToastList>
          <ToastItem
            message={toastMessage}
            icon={<CopyFillIcon className="h-5 w-5 text-orange-500" />}
          />
        </ToastList>
      )}
    </>
  );
}
