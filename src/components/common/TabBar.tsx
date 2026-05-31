import { useRef } from "react";
import { useLocation } from "react-router";
import {
  TabHomeIcon,
  PhotoLabIcon,
  ChatIcon,
  MyPageIcon,
  TabHomeFillIcon,
  PhotoLabFillIcon,
  ChatFillIcon,
  MyPageFillIcon,
} from "@/assets/icon";
import type { TabItem } from "@/types/tab";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";

const tabs: (TabItem & { id?: string })[] = [
  {
    to: "/mainpage",
    label: "홈",
    icon: TabHomeIcon,
    activeIcon: TabHomeFillIcon,
    end: true,
  },
  {
    to: "/photolab",
    label: "현상소 보기",
    icon: PhotoLabIcon,
    activeIcon: PhotoLabFillIcon,
  },
  {
    to: "/photoFeed",
    label: "사진수다",
    icon: ChatIcon,
    activeIcon: ChatFillIcon,
  },
  {
    to: "/mypage",
    label: "마이페이지",
    icon: MyPageIcon,
    activeIcon: MyPageFillIcon,
  },
];

export const TabBar = () => {
  const { pathname } = useLocation();

  const { requireAuthNavigate } = useRequireAuth();

  // 가장 최근 탭 클릭을 나타내는 토큰
  const navTokenRef = useRef(0);

  // 어느 탭이든 누르면 이전 작업은 무효화
  const bumpToken = () => {
    navTokenRef.current += 1;
    return navTokenRef.current;
  };

  const isTabActive = (tab: TabItem) => {
    if (tab.end) return pathname === tab.to;
    return pathname.startsWith(tab.to);
  };

  // 탭 클릭 -> 누르는 순간 이전 비동기 네비게이션 모두 무효화
  const onClickTab = (to: string) => {
    bumpToken();
    requireAuthNavigate(to);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-4 py-6">
      <nav className="grid h-full grid-cols-4">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.to}
              type="button"
              onClick={() => onClickTab(tab.to)}
              className={[
                "flex flex-col items-center justify-center gap-1.5 active:scale-[0.99]",
                isActive ? "text-orange-500" : "text-neutral-300",
              ].join(" ")}
              aria-label={tab.label}
            >
              <Icon className="h-[1.5rem] w-[1.5rem]" />
              <span className="text-center text-xs">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
