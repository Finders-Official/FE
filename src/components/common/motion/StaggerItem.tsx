import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface StaggerItemProps {
  index?: number;
  className?: string;
  children: ReactNode;
}

export function StaggerItem({
  index,
  className = "",
  children,
}: StaggerItemProps) {
  const [shown, setShown] = useState(index === undefined);

  useEffect(() => {
    if (index === undefined) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [index]);

  const staggerClass =
    index === undefined ? "" : `t-stagger-item${shown ? " is-in" : ""}`;

  return (
    <div
      className={[staggerClass, className].filter(Boolean).join(" ")}
      style={
        index !== undefined ? ({ "--i": index } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
