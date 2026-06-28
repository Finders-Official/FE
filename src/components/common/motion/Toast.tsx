import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useReveal } from "@/transitions";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  icon?: ReactNode;
  duration?: number;
  resetKey?: number;
  aboveTabBar?: boolean;
}

export function Toast({
  open,
  onClose,
  message,
  icon,
  duration = 2000,
  resetKey,
  aboveTabBar = false,
}: ToastProps) {
  const { mounted, getRevealProps } = useReveal(open, { variant: "toast" });
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(id);
  }, [open, duration, resetKey]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed left-1/2 z-[9999] -translate-x-1/2 ${
        aboveTabBar
          ? "bottom-[calc(var(--tabbar-height)+1rem)]"
          : "bottom-[2rem]"
      }`}
    >
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
