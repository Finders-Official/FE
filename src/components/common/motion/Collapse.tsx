import type { ReactNode } from "react";

interface CollapseProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function Collapse({ open, children, className = "" }: CollapseProps) {
  return (
    <div
      className={`ease-smooth-out grid transition-[grid-template-rows] duration-[var(--duration-fast)] motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      } ${className}`}
    >
      <div className="min-h-0 overflow-hidden" inert={!open}>
        {children}
      </div>
    </div>
  );
}
