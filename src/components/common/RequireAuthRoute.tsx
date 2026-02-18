import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuth.store";
import { useLoginModalStore } from "@/store/useLoginModal.store";

type Props = {
  redirectTo?: string; // 안 넘기면 기본 로그인으로
};

export function RequireAuthRoute({ redirectTo = "/auth/login" }: Props) {
  const user = useAuthStore((s) => s.user);
  const openLoginModal = useLoginModalStore((s) => s.openLoginModal);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    //현재 가려던 목적지 저장 -> 모달을 보여줄 지 바로 리다이렉 시킬지 고민중
    const from = location.pathname + location.search + location.hash;

    //이미 로그인 페이지면 무한 루프 방지
    if (location.pathname.startsWith("/auth/login")) return;

    //보호 라우트에 머무르지 말고 즉시 로그인으로 리다이렉트
    navigate(redirectTo, {
      replace: true,
      state: { from },
    });
  }, [
    user,
    openLoginModal,
    navigate,
    redirectTo,
    location.pathname,
    location.search,
    location.hash,
  ]);

  // user 없으면 보호 컨텐츠 렌더링 차단
  if (!user) return null;

  return <Outlet />;
}
