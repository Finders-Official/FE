import type { TabName } from "@/types/mypage/notice";
import { SlidingTabs } from "@/components/common";

interface TabNavigationProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs: TabName[] = ["일반공지", "이벤트 안내", "약관/정책"];

  return (
    <div className="w-full">
      <SlidingTabs
        tabs={tabs}
        activeIndex={tabs.indexOf(activeTab)}
        onChange={(index) => setActiveTab(tabs[index])}
        tabClassName="flex-1 py-4 text-[1rem] font-medium"
        inactiveClassName="text-neutral-750 hover:text-neutral-400"
      />
    </div>
  );
}
