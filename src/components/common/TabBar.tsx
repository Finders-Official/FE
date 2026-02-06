import { useLocation } from "react-router";
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
import { useCurrentWorkNavigation } from "@/hooks/photoManage/useCurrentWorkNavigation";
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
    id: "manage",
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

const MANAGE_TAB_PATHS = ["/photoManage", "/development-history"];

export const TabBar = () => {
  const { handleNavigationClick, isChecking } = useCurrentWorkNavigation();
  const { pathname } = useLocation();
  const { requireAuth, requireAuthNavigate } = useRequireAuth();

  const isTabActive = (tab: TabItem) => {
    if (tab.end) {
      return pathname === tab.to;
    }
    return pathname.startsWith(tab.to);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-6 py-5">
      <nav className="grid h-full grid-cols-5 gap-1">
        {tabs.map((tab) => {
          if (tab.id === "manage") {
            const isManageTabActive = MANAGE_TAB_PATHS.some((path) =>
              pathname.startsWith(path),
            );
            const ManageTabIcon = isManageTabActive ? tab.activeIcon : tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => requireAuth(handleNavigationClick)}
                disabled={isChecking}
                className={[
                  "flex flex-col items-center justify-center active:scale-[0.99]",
                  isManageTabActive ? "text-orange-500" : "text-neutral-300",
                ].join(" ")}
                aria-label={tab.label}
              >
                <ManageTabIcon className="h-[1.5rem] w-[1.5rem]" />
                <span className="mt-auto text-center text-xs">{tab.label}</span>
              </button>
            );
          }

          const isActive = isTabActive(tab);
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.to}
              onClick={() => requireAuthNavigate(tab.to)}
              className={[
                "flex flex-col items-center justify-center active:scale-[0.99]",
                isActive ? "text-orange-500" : "text-neutral-300",
              ].join(" ")}
              aria-label={tab.label}
            >
              <Icon className="h-[1.5rem] w-[1.5rem]" />
              <span className="mt-auto text-center text-xs">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
