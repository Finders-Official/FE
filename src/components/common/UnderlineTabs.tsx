import { SlidingTabs } from "./motion";

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
    <SlidingTabs
      tabs={tabs.map((t) => t.label)}
      activeIndex={activeIndex}
      onChange={onChange}
      className={`h-[3.4375rem] ${className}`}
      tabClassName="flex-1 px-[0.625rem] py-[0.75rem] text-[1rem] leading-[155%] font-semibold tracking-[-0.02em]"
    />
  );
}

export type { UnderlineTabsProps, TabItem };
