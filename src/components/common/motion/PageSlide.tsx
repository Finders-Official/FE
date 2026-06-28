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
  return (
    <div
      key={step}
      data-dir={direction === "back" ? "back" : undefined}
      className={`t-page-enter ${className}`.trim()}
    >
      {children}
    </div>
  );
}
