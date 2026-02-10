import { useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { handleNavigationClick, isChecking } = useCurrentWorkNavigation();
  const { requireAuth, requireAuthNavigate } = useRequireAuth();

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

  const isManageTabActive = useMemo(
    () => MANAGE_TAB_PATHS.some((p) => pathname.startsWith(p)),
    [pathname],
  );

  // Manage 탭 클릭 -> 비로그인이면 requireAuth가 모달만 띄우고 진입 막기
  const onClickManage = () => {
    const token = bumpToken();

    requireAuth(async () => {
      // 로그인 성공,로그인 상태일 때만 현상관리 탭 진입 가능
      if (navTokenRef.current !== token) return;

      try {
        await handleNavigationClick();
      } catch {
        return;
      }

      if (navTokenRef.current !== token) return;
      navigate("/photoManage/main");
    });
  };

  // 일반 탭 클릭 -> 누르는 순간 이전 비동기 네비게이션 모두 무효화
  const onClickTab = (to: string) => {
    bumpToken();
    requireAuthNavigate(to);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-6 py-5">
      <nav className="grid h-full grid-cols-5 gap-1">
        {tabs.map((tab) => {
          if (tab.id === "manage") {
            const Icon = isManageTabActive ? tab.activeIcon : tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={onClickManage}
                disabled={isChecking}
                className={[
                  "flex flex-col items-center justify-center active:scale-[0.99]",
                  isManageTabActive ? "text-orange-500" : "text-neutral-300",
                ].join(" ")}
                aria-label={tab.label}
              >
                <Icon className="h-[1.5rem] w-[1.5rem]" />
                <span className="mt-auto text-center text-xs">{tab.label}</span>
              </button>
            );
          }

          const isActive = isTabActive(tab);
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.to}
              type="button"
              onClick={() => onClickTab(tab.to)}
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
