interface TabItem {
  label: string;
}

interface UnderlineTabsProps {
  tabs: TabItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export default function UnderlineTabs({
  tabs,
  activeIndex,
  onChange,
  className = "",
}: UnderlineTabsProps) {
  return (
    <div role="tablist" className={`flex h-[3.4375rem] w-full ${className}`}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(index)}
            className={`flex flex-1 items-center justify-center border-b-[0.09375rem] px-[0.625rem] py-[0.75rem] text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] transition-colors ${isActive ? "border-orange-500 text-orange-500" : "border-neutral-800 text-neutral-200"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export type { UnderlineTabsProps, TabItem };
