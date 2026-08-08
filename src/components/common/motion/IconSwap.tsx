import type { CSSProperties, ReactNode } from "react";

interface IconSwapProps {
  active: boolean;
  iconA: ReactNode;
  iconB: ReactNode;
  className?: string;
  bounce?: boolean;
}

export function IconSwap({
  active,
  iconA,
  iconB,
  className = "",
  bounce = false,
}: IconSwapProps) {
  return (
    <span
      className={`t-icon-swap ${className}`}
      data-state={active ? "b" : "a"}
      style={
        bounce
          ? ({ "--icon-swap-ease": "var(--ease-bounce)" } as CSSProperties)
          : undefined
      }
    >
      <span className="t-icon" data-icon="a">
        {iconA}
      </span>
      <span className="t-icon" data-icon="b">
        {iconB}
      </span>
    </span>
  );
}
