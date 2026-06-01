import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { App as CapacitorApp, type URLOpenListenerEvent } from "@capacitor/app";
import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const setupAppListener = async () => {
      await CapacitorApp.addListener(
        "appUrlOpen",
        (data: URLOpenListenerEvent) => {
          // 안전장치 1: data나 data.url이 없으면 실행하지 않음
          if (!data || !data.url) return;

          try {
            const url = new URL(data.url);

            if (url.host === "oauth") {
              const code = url.searchParams.get("code");
              const state = url.searchParams.get("state");

              if (code) {
                navigate(`/oauth/callback?code=${code}&state=${state}`);
              }
            }
          } catch (error) {
            // 안전장치 2: URL 형식이 아니어도 앱이 죽지 않고 에러만 로그에 찍히게 함
            console.error("딥링크 URL 파싱 에러:", error);
          }
        },
      );
    };

    setupAppListener();

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
