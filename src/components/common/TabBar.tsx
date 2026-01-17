import { NavLink } from "react-router";
import {
  TabHomeIcon,
  PhotoLabIcon,
  ChatIcon,
  ManageIcon,
  MyPageIcon,
  TabHomeFillIcon,
  PhotoLabFillIcon,
  ChatFillIcon,
  ManageFillIcon,
  MyPageFillIcon,
} from "@/assets/icon";
import type { TabItem } from "@/types/tab";

const tabs: TabItem[] = [
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
    to: "/photoManage/main",
    label: "현상 관리",
    icon: ManageIcon,
    activeIcon: ManageFillIcon,
  },
  {
    to: "/mypage",
    label: "마이페이지",
    icon: MyPageIcon,
    activeIcon: MyPageFillIcon,
  },
];

export const TabBar = () => {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-6 py-5">
      <nav className="grid h-full grid-cols-5 gap-1">
        {tabs.map((tab) => {
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center justify-center active:scale-[0.99]",
                  isActive ? "text-orange-500" : "text-neutral-300",
                ].join(" ")
              }
              aria-label={tab.label}
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.activeIcon : tab.icon;
                return (
                  <>
                    <Icon className="h-[1.5rem] w-[1.5rem]" />
                    <span className="mt-auto text-center text-xs">
                      {tab.label}
                    </span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
