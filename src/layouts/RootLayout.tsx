import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-900 text-neutral-100">
      <GlobalLoginDialog />
      {/* safe-area + 중앙 레이아웃(PC) + 패딩(모바일) */}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:px-6 lg:px-8">
        {/* Rootlayout으로 감싸진 모든 컴포넌트 렌더링*/}
        <main className="flex min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
