import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useKakaoOauth } from "@/hooks/auth/login";

export function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  //1 카카오 취소/거부 처리
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const error = sp.get("error");
    const errorDesc = sp.get("error_description");

    console.log(errorDesc);

    // 취소/거부/실패 케이스는 여기서 전부 로그인으로 보냄
    if (error) {
      navigate("/auth/login", { replace: true });
      return;
    }

    // code 자체가 없으면 비정상 접근/실패로 간주
    const code = sp.get("code");
    if (!code) {
      navigate("/auth/login", { replace: true });
      return;
    }
  }, [location.search, navigate]);

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
