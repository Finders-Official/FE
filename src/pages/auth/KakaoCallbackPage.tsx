import { useKakaoOauth } from "@/hooks/auth/login/useKakaoOAuth";
import { useNavigate } from "react-router";

export function KakaoCallbackPage() {
  const navigate = useNavigate();

  //1. 기존 회원 : 바로 메인페이지로 리다이렉
  //2. 신규 회원: 온보딩 화면으로 리다이렉
  //3. 실패시 login 페이지로 리다이렉
  const { isPending } = useKakaoOauth({
    onExistingMember: () => navigate("/mainpage", { replace: true }),
    onNewMember: () => navigate("/auth/onboarding", { replace: true }),
    onFail: () => navigate("/auth/login", { replace: true }),
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center">
      <p className="text-sm text-neutral-200">
        {isPending ? "카카오 로그인 처리 중..." : "리다이렉트 처리 중..."}
      </p>
    </main>
  );
}
