import { useNavigate } from "react-router";
import { useKakaoOauth } from "@/hooks/auth/login";
import { consumeRedirectAfterLogin } from "@/pages/demoDay/redirectAfterLogin"; // DEMO-DAY

export function KakaoCallbackPage() {
  const navigate = useNavigate();

  //1. 기존 회원: 바로 메인페이지로 리다이렉
  //2. 신규 회원: 약관 동의 화면으로 리다이렉
  //3. 실패(취소/거부/비정상 접근): 로그인 페이지로 리다이렉

  const { isPending } = useKakaoOauth({
    onExistingMember: () => {
      // DEMO-DAY: 원래는 navigate("/mainpage", { replace: true })
      const redirect = consumeRedirectAfterLogin();
      navigate(redirect ?? "/mainpage", { replace: true });
    },
    onNewMember: () => navigate("/auth/agreement", { replace: true }),
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
