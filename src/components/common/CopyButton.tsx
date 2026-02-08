import { useState, useRef, useCallback, useEffect } from "react";
import { CopyIcon, CopyFillIcon, ExclamationCircleIcon } from "@/assets/icon";
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
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showToast = useCallback((error: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsError(error);
    setMounted(true);
    setVisible(true);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
      }, 200);
    }, 1800);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(false);
    } catch {
      showToast(true);
    }
  }, [text, showToast]);

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
              message={isError ? "복사에 실패했습니다." : toastMessage}
              icon={
                isError ? (
                  <ExclamationCircleIcon className="text-orange-450 h-5 w-5" />
                ) : (
                  <CopyFillIcon className="text-orange-450 h-5 w-5" />
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
