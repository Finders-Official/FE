import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-900 text-neutral-100">
      {/* safe-area + 중앙 레이아웃(PC) + 패딩(모바일) */}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1200px] flex-col px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:px-6 lg:px-8">
        {/* Rootlayout으로 감싸진 모든 컴포넌트 렌더링*/}
        <Outlet />
      </div>
    </div>
  );
}
