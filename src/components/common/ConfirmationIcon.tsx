import { useEffect, useState } from "react";

interface ConfirmationIconProps {
  className?: string;
  animate?: boolean;
}

export default function ConfirmationIcon({
  className,
  animate = false,
}: ConfirmationIconProps) {
  const [state, setState] = useState<"out" | "in">("out");

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setState("in")),
    );
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const size = className ?? "h-12 w-12";
  const wrapperClass = animate
    ? `t-success-check [--check-rotate-from:28deg] [--check-y-amount:16px] [--check-blur-from:6px] relative ${size}`
    : `relative ${size}`;

  return (
    <div className={wrapperClass} data-state={animate ? state : undefined}>
      <svg
        className="absolute top-0 left-0 h-[60%] w-[60%]"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="30" height="30" rx="8" fill="#E94E16" />
      </svg>

      <div
        className="absolute right-0 bottom-0 h-[82%] w-[82%] rounded-[10px]"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          WebkitBackdropFilter: "blur(6px)",
          backdropFilter: "blur(6px)",
        }}
      />

      <svg
        className="absolute"
        style={{
          left: "37%",
          top: "41%",
          width: "45%",
          height: "36%",
        }}
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 9.34L8.18 13.8L17 2"
          pathLength={20}
          stroke="#D9D9D9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
          }}
        />
      </svg>
    </div>
  );
}
