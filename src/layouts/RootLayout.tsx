import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { DialogBox } from "@/components/common/DialogBox";
import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";
import { useNewPostState } from "@/store/useNewPostState.store";

export default function RootLayout() {
  const navigate = useNavigate();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Promise 자체를 붙잡아, resolve 타이밍과 무관하게 클린업에서 리스너를 제거한다.
    const handlePromise = App.addListener("backButton", ({ canGoBack }) => {
      // 종료 다이얼로그가 떠 있으면 뒤로가기는 다이얼로그만 닫는다
      // (DialogBox의 useDismiss는 pointerdown/Escape만 처리 — 안드로이드 back은 안 잡힘)
      if (isExitDialogOpen) {
        setIsExitDialogOpen(false);
        return;
      }

      // 게시글 등록 직후엔 하드웨어 뒤로가기도 이전 작성 단계가 아니라 피드로 이동
      if (useNewPostState.getState().isNewPost) {
        useNewPostState.getState().setIsNewPost(false);
        navigate("/photoFeed");
        return;
      }

      if (canGoBack) {
        navigate(-1);
        return;
      }

      // 가입 플로우(약관/온보딩)는 전 구간 replace라 히스토리가 비어 있다.
      // 여기서 앱을 닫으면 입력 중이던 가입 정보가 날아가므로 로그인으로 되돌린다.
      // (이벤트 발생 시점에 읽어야 리스너 재등록 없이 최신 경로가 잡힌다)
      const { pathname } = window.location;
      if (pathname.startsWith("/auth/") && pathname !== "/auth/login") {
        navigate("/auth/login", { replace: true });
        return;
      }

      // 뒤로 갈 히스토리가 없음(=뒤로가기 시 앱 종료): 즉시 종료 대신 확인 다이얼로그
      setIsExitDialogOpen(true);
    });

    return () => {
      handlePromise.then((handle) => handle.remove());
    };
  }, [navigate, isExitDialogOpen]);

  return (
    <div className="min-h-dvh w-full bg-neutral-900 text-neutral-100">
      <GlobalLoginDialog />
      <DialogBox
        isOpen={isExitDialogOpen}
        title="파인더스 앱 닫기"
        description="파인더스를 종료하시겠어요?"
        cancelText="아니오"
        onCancel={() => setIsExitDialogOpen(false)}
        confirmText="네"
        onConfirm={() => App.exitApp()}
      />
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
