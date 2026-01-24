import { useNavigate } from "react-router";
import { useKakaoOauth } from "@/hooks/auth/useKakaoOAuth";

export function KakaoCallbackPage() {
  const navigate = useNavigate();

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
