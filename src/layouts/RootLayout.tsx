import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";
import { useNewPostState } from "@/store/useNewPostState.store";
import { useAuthStore } from "@/store/useAuth.store";
import { usePushNotifications } from "@/hooks/notifications";

export default function RootLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // 로그인 상태일 때만 푸시 토큰 등록/리스너 활성화
  // (로그인 순간뿐 아니라 이미 로그인된 세션으로 앱을 재실행한 경우도 커버)
  usePushNotifications(!!user, navigate);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Promise 자체를 붙잡아, resolve 타이밍과 무관하게 클린업에서 리스너를 제거한다.
    const handlePromise = App.addListener("backButton", ({ canGoBack }) => {
      // 게시글 등록 직후엔 하드웨어 뒤로가기도 이전 작성 단계가 아니라 피드로 이동
      if (useNewPostState.getState().isNewPost) {
        useNewPostState.getState().setIsNewPost(false);
        navigate("/photoFeed");
        return;
      }

      if (canGoBack) {
        navigate(-1);
      } else {
        App.exitApp();
      }
    });

    return () => {
      handlePromise.then((handle) => handle.remove());
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
