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
  const { requireAuthNavigate } = useRequireAuth();

  // 가장 최근 탭 클릭을 나타내는 토큰
  const navTokenRef = useRef(0);

  //어느 탭이든 누르면, 이전 작업은 무효화 -> abort
  const bumpToken = () => {
    navTokenRef.current += 1;
    return navTokenRef.current;
  };

  const isTabActive = (tab: TabItem) => {
    if (tab.end) return pathname === tab.to;
    return pathname.startsWith(tab.to);
  };

  // 현상 관리 탭 활성화 여부
  const isManageTabActive = useMemo(
    () => MANAGE_TAB_PATHS.some((p) => pathname.startsWith(p)),
    [pathname],
  );

  // Manage 탭 클릭 (비동기/체크가 늦게 끝나도 토큰으로 가드)
  const onClickManage = async () => {
    const token = bumpToken();

    // 1) 로그인 필요 여부 처리
    requireAuthNavigate("/photoManage/main");
    if (navTokenRef.current !== token) return;

    // 2) 현상관리 진입 체크 -> delay 되는 부분
    try {
      await handleNavigationClick();
    } catch {
      // handleNavigationClick 내부 처리로 인해 return 만 적용
      return;
    }

    // 3) 클릭이 최신인 경우에만 최종 navigate
    if (navTokenRef.current !== token) return;
    navigate("/photoManage/main");
  };

  //일반 탭 클릭: 누르는 순간 이전 비동기 네비게이션 모두 Abort
  const onClickTab = (to: string) => {
    bumpToken();
    requireAuthNavigate(to);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-6 py-5">
      <nav className="grid h-full grid-cols-5 gap-1">
        {tabs.map((tab) => {
          // 현상 관리 탭과 그 외 탭 분기 처리
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
