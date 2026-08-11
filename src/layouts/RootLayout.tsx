import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import GlobalLoginDialog from "@/components/common/GlobalLoginDialog";
import { DialogBox } from "@/components/common/DialogBox";
import { useNewPostState } from "@/store/useNewPostState.store";

export default function RootLayout() {
  const navigate = useNavigate();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Promise 자체를 붙잡아, resolve 타이밍과 무관하게 클린업에서 리스너를 제거한다.
    const handlePromise = App.addListener("backButton", ({ canGoBack }) => {
      // 종료 다이얼로그가 떠 있으면 뒤로가기로 닫기만 한다
      if (exitDialogOpen) {
        setExitDialogOpen(false);
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
      } else {
        setExitDialogOpen(true);
      }
    });

    return () => {
      handlePromise.then((handle) => handle.remove());
    };
  }, [navigate, exitDialogOpen]);

  return (
    <div className="min-h-dvh w-full bg-neutral-900 text-neutral-100">
      <GlobalLoginDialog />
      <DialogBox
        isOpen={exitDialogOpen}
        title="앱을 종료하시겠어요?"
        confirmText="종료"
        cancelText="취소"
        onConfirm={() => App.exitApp()}
        onCancel={() => setExitDialogOpen(false)}
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
