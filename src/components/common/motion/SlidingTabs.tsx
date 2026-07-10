import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface SlidingTabsProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
  tabClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function SlidingTabs({
  tabs,
  activeIndex,
  onChange,
  className = "",
  tabClassName = "flex-1 px-[0.625rem] py-[0.75rem] text-[1rem] font-semibold",
  activeClassName = "text-orange-500",
  inactiveClassName = "text-neutral-200",
}: SlidingTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeIndex, tabs.length]);

  useEffect(() => {
    const onResize = () => {
      const el = tabRefs.current[activeIndex];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  return (
    <div
      role="tablist"
      className={`relative flex w-full border-b border-neutral-800 ${className}`}
    >
      {tabs.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(index)}
            className={`ease-smooth-out flex items-center justify-center transition-colors duration-[var(--duration-quick)] motion-reduce:transition-none ${tabClassName} ${
              isActive ? activeClassName : inactiveClassName
            }`}
          >
            {label}
          </button>
        );
      })}
      <span
        aria-hidden="true"
        className="ease-smooth-out absolute bottom-0 h-[0.125rem] rounded-full bg-orange-500 transition-[transform,width] duration-[var(--duration-fast)] motion-reduce:transition-none"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
        }}
      />
    </div>
  );
}
