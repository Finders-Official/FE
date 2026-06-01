import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { App as CapacitorApp, type URLOpenListenerEvent } from "@capacitor/app";
import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 앱이 커스텀 스킴 URL을 통해 켜졌을 때 실행되는 리스너
    const setupAppListener = async () => {
      await CapacitorApp.addListener(
        "appUrlOpen",
        (data: URLOpenListenerEvent) => {
          const url = new URL(data.url);

          // 카카오 로그인 콜백 스킴 처리
          if (url.host === "oauth") {
            const code = url.searchParams.get("code");
            const state = url.searchParams.get("state");

            if (code) {
              navigate(`/oauth/callback?code=${code}&state=${state}`);
            }
          }
        },
      );
    };

    setupAppListener();

    // 언마운트 시 리스너 정리
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [navigate]);

  return (
    <div className="min-h-dvh w-full bg-neutral-900 text-neutral-100">
      <GlobalLoginDialog />
      {/* safe-area + 중앙 레이아웃(PC) + 패딩(모바일) */}
      <div className="mx-auto flex min-h-dvh w-full max-w-120 flex-col px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:px-6 lg:px-8">
        {/* Rootlayout으로 감싸진 모든 컴포넌트 렌더링*/}
        <main className="flex min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
