// MyPageLayout.tsx
import { Navigate, Outlet, useMatches, useNavigate } from "react-router";
import Header from "@/components/common/Header";
import { TabBar } from "@/components/common/TabBar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuth.store";
import { useLoginModalStore } from "@/store/useLoginModal.store";

type Handle = {
  title?: string;
  isTab?: boolean;
  showBack?: boolean;
  hideHeader?: boolean;
};

export type MyPageOutletContext = {
  setCustomOnBack: (fn: (() => void) | null) => void;
};

export default function MyPageLayout() {
  const matches = useMatches();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useLoginModalStore((state) => state.openLoginModal);

  const last = matches[matches.length - 1];
  const handle = (last.handle as Handle | undefined) ?? {};
  const title = handle.title ?? "마이페이지";

  const isTab = handle.isTab ?? false;
  const showBack = handle.showBack ?? true;
  const hideHeader = handle.hideHeader ?? false;

  // 커스텀 뒤로가기 상태
  const [customOnBack, setCustomOnBack] = useState<(() => void) | null>(null);

  // 로그인 필요한 영역 — 미인증 진입(딥링크/새로고침/세션만료) 시 로그인 모달 후 공개 홈으로
  useEffect(() => {
    if (!user) openLoginModal();
  }, [user, openLoginModal]);

  if (!user) {
    return <Navigate to="/mainpage" replace />;
  }

  return (
    <div className="flex min-h-0 w-full flex-col">
      {!hideHeader && (
        <Header
          title={title}
          showBack={showBack}
          onBack={customOnBack ? customOnBack : () => navigate(-1)}
        />
      )}
      <main className="flex-1">
        <Outlet context={{ setCustomOnBack } satisfies MyPageOutletContext} />
      </main>
      {isTab && <TabBar />}
    </div>
  );
}
