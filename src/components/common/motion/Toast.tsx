import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useReveal } from "@/transitions";

const TOAST_PLACEMENTS = {
  bottom: "fixed right-0 bottom-0 left-0 z-[100] flex justify-center px-5 py-5",
  "above-tab":
    "fixed bottom-[var(--tabbar-height)] z-[100] ml-4 flex items-center justify-center",
} as const;

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  icon?: ReactNode;
  duration?: number;
  resetKey?: number;
  placement?: keyof typeof TOAST_PLACEMENTS;
  className?: string;
}

export function Toast({
  open,
  onClose,
  message,
  icon,
  duration = 2000,
  resetKey,
  placement = "bottom",
  className,
}: ToastProps) {
  const wrapperClass = className ?? TOAST_PLACEMENTS[placement];
  const { mounted, getRevealProps } = useReveal(open, { variant: "toast" });
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(id);
  }, [open, duration, message, resetKey]);

  if (!mounted) return null;

  return (
    <div className={wrapperClass}>
      <div {...getRevealProps({ className: "relative w-[20.3125rem]" })}>
        <div className="bg-neutral-875/70 absolute inset-0 rounded-[1.125rem] border border-neutral-800 shadow-lg backdrop-blur-3xl" />
        <div className="relative flex items-center gap-[1rem] px-[1.25rem] py-[1rem]">
          {icon && (
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-neutral-400">
              {icon}
            </div>
          )}
          <span className="text-[0.938rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-200">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
