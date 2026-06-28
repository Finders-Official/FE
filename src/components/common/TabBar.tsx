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
import { Press } from "@/components/common/motion";
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    // Android WebView의 file input File은 content provider를 가리키는 지연 참조라
    // 이후 fetch(blob:)로 다시 읽을 때 실패할 수 있다. 선택 즉시 바이트를
    // 메모리로 복사한 Blob으로 URL을 만들어 참조가 끊기지 않게 한다.
    const file = e.target.files[0];
    const blob = new Blob([await file.arrayBuffer()], {
      type: file.type || "image/*",
    });
    const objectUrl = URL.createObjectURL(blob);
    navigate("/restore/editor", { state: { imageUrl: objectUrl } });
    e.target.value = "";
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-(--tabbar-height) w-full max-w-6xl -translate-x-1/2 bg-neutral-900 px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
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
            <Press
              key={tab.to}
              type="button"
              onClick={() => onClickTab(tab.to)}
              className={[
                "flex flex-col items-center justify-center gap-1.5",
                isActive ? "text-orange-500" : "text-neutral-300",
              ].join(" ")}
              aria-label={tab.label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-center text-xs">{tab.label}</span>
            </Press>
          );
        })}

        <Press
          type="button"
          onClick={handleRestoreClick}
          className="flex flex-col items-center justify-center gap-1.5 text-neutral-300"
          aria-label="AI 사진복원"
        >
          <AiRestoreIcon className="h-6 w-6" />
          <span className="text-center text-xs">AI 사진복원</span>
        </Press>

        {tabs.slice(3).map((tab) => {
          const isActive = isTabActive(tab);
          const Icon = isActive ? tab.activeIcon : tab.icon;
          return (
            <Press
              key={tab.to}
              type="button"
              onClick={() => onClickTab(tab.to)}
              className={[
                "flex flex-col items-center justify-center gap-1.5",
                isActive ? "text-orange-500" : "text-neutral-300",
              ].join(" ")}
              aria-label={tab.label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-center text-xs">{tab.label}</span>
            </Press>
          );
        })}
      </nav>
    </div>
  );
};
