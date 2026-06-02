import { AppleButton, KakaoButton } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";
import { useAppleLogin, useLoginIntroUi } from "@/hooks/auth/login";
import { useAuthStore } from "@/store/useAuth.store";
import { Capacitor3KakaoLogin } from "capacitor3-kakao-login";
import { isNativeApp } from "@/utils/auth/envUtils";
import { oauth } from "@/apis/auth";
import { tokenStorage } from "@/utils/tokenStorage";
import { consumeRedirectAfterLogin } from "../demoDay/redirectAfterLogin";

const WELCOME_NONCE_SHOWN_KEY = "finders:welcomeNonceShown";
const WELCOME_ONCE_FALLBACK_KEY = "finders:welcomeOnceShown";

export function LoginPage() {
  const [sp, setSp] = useSearchParams();

  const nickname = useAuthStore((s) => s.user?.nickname);

  const welcome = sp.get("welcome") === "1";
  const nonce = sp.get("nonce");

  //이번 요청에서 welcome을 보여줘야 하는지(세션스토리지 기준)
  const shouldForceNow = useMemo(() => {
    if (!welcome) return false;
    if (typeof window === "undefined") return false;

    if (nonce) {
      const shownNonce = sessionStorage.getItem(WELCOME_NONCE_SHOWN_KEY);
      return shownNonce !== nonce;
    }

    const shown = sessionStorage.getItem(WELCOME_ONCE_FALLBACK_KEY) === "1";
    return !shown;
  }, [welcome, nonce]);

  // 핵심: ref 없이 "초기값으로만" latch (렌더 중 ref 접근 금지 룰 회피)
  const [forceWelcomeOnce] = useState<boolean>(() => shouldForceNow);

  // latch가 true인 케이스에서만: 기록 + URL 정리
  useEffect(() => {
    if (!forceWelcomeOnce) return;
    if (typeof window === "undefined") return;

    if (nonce) sessionStorage.setItem(WELCOME_NONCE_SHOWN_KEY, nonce);
    else sessionStorage.setItem(WELCOME_ONCE_FALLBACK_KEY, "1");

    setSp(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("welcome");
        next.delete("nonce");
        return next;
      },
      { replace: true },
    );
  }, [forceWelcomeOnce, nonce, setSp]);

  const ui = useLoginIntroUi({
    forceWelcomeOnce,
    splashMs: 2000,
  });

  const navigate = useNavigate();

  const apple = useAppleLogin({
    onExistingMember: () => {
      const redirect = consumeRedirectAfterLogin();
      navigate(redirect ?? "/mainpage", { replace: true });
    },
    onNewMember: () => navigate("/auth/agreement", { replace: true }),
  });

  useEffect(() => {
    if (isNativeApp()) {
      const nativeAppKey = import.meta.env.VITE_PUBLIC_KAKAO_NATIVE_APP_KEY;
      if (nativeAppKey) {
        Capacitor3KakaoLogin.initializeKakao({
          app_key: nativeAppKey,
          web_key: "",
        })
          .then(() => console.log("카카오 플러그인 초기화 완료!"))
          .catch((error) => console.error("카카오 초기화 실패:", error));
      }
    }
  }, []);

  const setUser = useAuthStore((state) => state.setUser);

  const handleKakaoLogin = async () => {
    if (isNativeApp()) {
      try {
        const result = await Capacitor3KakaoLogin.kakaoLogin();
        const accessToken = result.value;

        const response = await oauth({
          provider: "KAKAO",
          credentialType: "ACCESS_TOKEN",
          credential: accessToken,
        });

        const data = response.data;

        // 1. 신규 회원 분기
        if ("isNewMember" in data && data.isNewMember === true) {
          // ✅ 훅에 있던 로직 가져옴 (signupToken 저장)
          tokenStorage.setTokens({
            accessToken: null,
            signupToken: data.signupToken,
          });
          navigate("/auth/onboarding", { replace: true });
        }
        // 2. 기존 회원 분기
        else if ("member" in data) {
          // 훅에 있던 로직 가져옴 (accessToken 저장 및 전역 상태 세팅)
          tokenStorage.setTokens({
            accessToken: data.accessToken,
            signupToken: null,
          });
          setUser({ memberId: data.member.id, nickname: data.member.nickname });

          // const redirect = consumeRedirectAfterLogin();
          // navigate(redirect ?? "/mainpage", { replace: true });
          navigate("/mainpage", { replace: true });
        } else {
          console.error("알 수 없는 로그인 응답 타입입니다:", data);
          navigate("/auth/login", { replace: true });
        }
      } catch (error) {
        console.error("앱 카카오 로그인/API 실패:", error);
        navigate("/auth/login", { replace: true });
      }
    } else {
      // 일반 웹은 기존처럼 URL 이동 (이후 콜백 페이지에서 올려주신 훅이 알아서 처리함)
      const url = buildKakaoAuthorizeUrl();
      window.location.assign(url);
    }
  };

  //화면 정책
  //1.mode=welcome : 축하 화면만
  //2.mode=normal & isSplash=true : "뷰파인더..." 문구만 2초
  //3.mode=normal & isSplash=false : 버튼(카카오/둘러보기)
  const showWelcome = ui.mode === "welcome";
  const showSplash = ui.mode === "normal" && ui.isSplash;
  const showLogin = ui.mode === "normal" && !ui.isSplash;

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <header
        className={`mt-60 flex flex-col items-center text-center ${ui.headerAnim}`}
      >
        <img
          src="/MainLogo.svg"
          alt="Main Logo"
          className="h-28 w-42 sm:h-32 sm:w-46"
        />

        <div key={ui.headerKey}>
          {showWelcome ? (
            <div className={ui.headerAnim}>
              <p className="mt-3 text-[1.375rem] font-bold">
                회원가입을 축하드려요!
              </p>
              <p className="text-md mt-2 text-neutral-400">
                뷰파인더 너머 {nickname}님의 취향을 찾아보세요
              </p>
            </div>
          ) : showSplash ? (
            <div className={ui.taglineAnim}>
              <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold sm:text-[3rem]">
                Finders
              </p>
            </div>
          ) : (
            <div>
              <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold sm:text-[3rem]">
                Finders
              </p>
              <p className="text-md mt-2 text-neutral-100 sm:text-base">
                뷰파인더 너머, 취향을 찾다
              </p>
            </div>
          )}
        </div>
      </header>

      <footer
        className={`mt-auto w-full py-5 ${showWelcome ? "border-neutral-850 border-t" : ""}`}
      >
        {showWelcome ? (
          <div
            key={ui.footerKey}
            className={`mx-auto flex w-full max-w-sm ${ui.footerAnim}`}
          >
            <CTA_Button
              text="홈으로"
              link="/mainpage"
              color="orange"
              size="compact"
            />
          </div>
        ) : showSplash ? (
          <div
            key={ui.footerKey}
            className={`mx-auto mb-10 flex w-full max-w-sm justify-center ${ui.footerAnim}`}
          >
            <p className="text-md mt-2 text-neutral-100 sm:text-base">
              뷰파인더 너머, 취향을 찾다
            </p>
          </div>
        ) : showLogin ? (
          <section
            key={ui.footerKey}
            className={`mx-auto max-w-sm ${ui.footerAnim}`}
          >
            <div className="flex flex-col gap-2">
              <AppleButton onClick={apple.login} disabled={apple.isPending} />
              <KakaoButton onClick={handleKakaoLogin} />
            </div>

            <Link
              to="/mainpage"
              className="mt-3 flex flex-col text-center text-sm font-medium text-neutral-200 underline underline-offset-2 active:scale-[0.99]"
            >
              로그인 없이 둘러보기
            </Link>
          </section>
        ) : null}
      </footer>
    </main>
  );
}
