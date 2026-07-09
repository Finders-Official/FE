import { useRef } from "react";
import type { ReactNode } from "react";

interface PageSlideProps {
  step: string | number;
  direction?: "forward" | "back";
  className?: string;
  children: ReactNode;
}

export function PageSlide({
  step,
  direction = "forward",
  className = "",
  children,
}: PageSlideProps) {
  const initialStepRef = useRef(step);
  const navigatedRef = useRef(false);
  if (step !== initialStepRef.current) navigatedRef.current = true;

  return (
    <div
      key={step}
      data-dir={direction === "back" ? "back" : undefined}
      className={
        navigatedRef.current ? `t-page-enter ${className}`.trim() : className
      }
    >
      {children}
    </div>
  );
}
