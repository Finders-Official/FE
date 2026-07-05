import { useRef, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  TabHomeIcon,
  PhotoLabIcon,
  ChatIcon,
  AiRestoreIcon,
  MyPageIcon,
  TabHomeFillIcon,
  PhotoLabFillIcon,
  ChatFillIcon,
  MyPageFillIcon,
} from "@/assets/icon";
import type { TabItem } from "@/types/tab";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";
import { useAuthStore } from "@/store/useAuth.store";

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
  const navigate = useNavigate();

  const { requireAuth, requireAuthNavigate } = useRequireAuth();
  const user = useAuthStore((s) => s.user);
  const isAuthed = Boolean(user?.memberId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTabActive = (tab: TabItem) => {
    if (tab.end) return pathname === tab.to;
    return pathname.startsWith(tab.to);
  };

  const onClickTab = (to: string) => {
    requireAuthNavigate(to);
  };

  const handleRestoreClick = () => {
    if (!isAuthed) {
      requireAuth(() => fileInputRef.current?.click());
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    navigate("/restore/editor", { state: { imageUrl: objectUrl } });
    e.target.value = "";
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[var(--tabbar-height)] w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-4 py-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <nav className="grid h-full grid-cols-5">
        {tabs.slice(0, 3).map((tab) => {
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
              <Icon className="h-6 w-6" />
              <span className="text-center text-xs">{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleRestoreClick}
          className="flex flex-col items-center justify-center gap-1.5 text-neutral-300 active:scale-[0.99]"
          aria-label="AI 사진복원"
        >
          <AiRestoreIcon className="h-6 w-6" />
          <span className="text-center text-xs">AI 사진복원</span>
        </button>

        {tabs.slice(3).map((tab) => {
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
              <Icon className="h-6 w-6" />
              <span className="text-center text-xs">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
