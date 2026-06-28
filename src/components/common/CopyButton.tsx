import { useState, useCallback } from "react";
import { CopyIcon, CopyFillIcon, ExclamationCircleIcon } from "@/assets/icon";
import { Toast } from "@/components/common/motion";

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
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nonce, setNonce] = useState(0);

  const handleCopy = useCallback(async () => {
    let error = false;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      error = true;
    }
    setIsError(error);
    setOpen(true);
    setNonce((n) => n + 1);
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

      <Toast
        open={open}
        onClose={() => setOpen(false)}
        resetKey={nonce}
        duration={1800}
        className={
          aboveTabBar
            ? "fixed bottom-[calc(var(--tabbar-height)+1rem)] left-1/2 z-[9999] -translate-x-1/2"
            : "fixed bottom-[2rem] left-1/2 z-[9999] -translate-x-1/2"
        }
        message={isError ? "복사에 실패했습니다." : toastMessage}
        icon={
          isError ? (
            <ExclamationCircleIcon className="text-orange-450 h-5 w-5" />
          ) : (
            <CopyFillIcon className="text-orange-450 h-5 w-5" />
          )
        }
      />
    </>
  );
}
