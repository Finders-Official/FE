import { AppleButton, KakaoButton } from "@/components/auth";
import { CTA_Button, Press } from "@/components/common";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";
import { useAppleLogin, useLoginIntroUi } from "@/hooks/auth/login";
import { useAuthStore } from "@/store/useAuth.store";
import { Capacitor3KakaoLogin } from "capacitor3-kakao-login";
import { isNativeApp } from "@/utils/auth/envUtils";
import { isAndroidApp } from "@/utils/platform";
import { oauth } from "@/apis/auth";
import { tokenStorage } from "@/utils/tokenStorage";
import { consumeRedirectAfterLogin } from "../demoDay/redirectAfterLogin";
import { SplashScreen } from "@capacitor/splash-screen"; // 앱 초기 스플래시 제어용
import { me } from "@/apis/member";

const WELCOME_NONCE_SHOWN_KEY = "finders:welcomeNonceShown";
const WELCOME_ONCE_FALLBACK_KEY = "finders:welcomeOnceShown";

type AuthCheckStatus = "pending" | "loggedIn" | "loggedOut";

export function LoginPage() {
  const [sp, setSp] = useSearchParams();

  const nickname = useAuthStore((s) => s.user?.nickname);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const welcome = sp.get("welcome") === "1";
  const nonce = sp.get("nonce");
  const navigate = useNavigate();

  // 자동 로그인(토큰 유무) 상태 관리
  const [authCheckStatus, setAuthCheckStatus] =
    useState<AuthCheckStatus>("pending");

  // 앱 실행 시 네이티브 스플래시 숨김 & 백그라운드 토큰 검사
  useEffect(() => {
    // 앱인 경우 기본 제공되는 스플래시를 즉시 가리고 리액트 애니메이션 띄우기
    if (isNativeApp()) {
      SplashScreen.hide().catch(console.error);
    }

    const checkToken = async () => {
      const accessToken = await tokenStorage.getAccessToken();

      if (!accessToken) {
        setAuthCheckStatus("loggedOut");
        return;
      }

      try {
        const res = await me();

        setUser({
          memberId: res.data.member.memberId,
          nickname:
            res.data.roleData.user?.nickname ??
            res.data.roleData.owner?.nickname ??
            res.data.roleData.admin?.nickname ??
            "",
        });

        setAuthCheckStatus("loggedIn");
      } catch (e) {
        console.error("me 실패", e);
        await tokenStorage.clear();
        clearUser();
        setAuthCheckStatus("loggedOut");
      }
    };

    checkToken();
  }, []);

  // 환영 화면 세션스토리지 로직
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

  const [forceWelcomeOnce] = useState<boolean>(() => shouldForceNow);

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

  // 애니메이션 훅 실행 (기본 2초 세팅)
  const ui = useLoginIntroUi({
    forceWelcomeOnce,
    splashMs: 2000,
  });

  //  애니메이션 완료 & 토큰 검사 완료 시점 동기화하여 라우팅
  useEffect(() => {
    // welcome 모드일 때는 자동 라우팅을 막고 사용자가 '홈으로' 버튼을 누르게 함
    if (ui.mode === "welcome") return;

    // 애니메이션 2초가 끝났고 && 로그인 상태임이 확인되면 -> 메인으로 이동
    if (!ui.isSplash && authCheckStatus === "loggedIn") {
      const redirect = consumeRedirectAfterLogin();
      navigate(redirect ?? "/mainpage", { replace: true });
    }
  }, [ui.isSplash, authCheckStatus, ui.mode, navigate]);

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
        }).catch((error) => console.error("카카오 초기화 실패:", error));
      }
    }
  }, []);

  const handleKakaoLogin = async () => {
    if (isNativeApp()) {
      try {
        const result = await Capacitor3KakaoLogin.kakaoLogin();
        const response = await oauth({
          provider: "KAKAO",
          credentialType: "ACCESS_TOKEN",
          credential: result.value,
        });

        const data = response.data;

        if ("isNewMember" in data && data.isNewMember === true) {
          await tokenStorage.setTokens({
            accessToken: null,
            signupToken: data.signupToken,
          });
          navigate("/auth/onboarding", { replace: true });
        } else if ("member" in data) {
          await tokenStorage.setTokens({
            accessToken: data.accessToken,
            signupToken: null,
          });
          setUser({ memberId: data.member.id, nickname: data.member.nickname });
          navigate("/mainpage", { replace: true });
        }
      } catch (error) {
        console.error("앱 카카오 로그인 실패:", error);
      }
    } else {
      window.location.assign(buildKakaoAuthorizeUrl());
    }
  };

  // 화면 정책 (번쩍임 방지 로직 적용)
  const showWelcome = ui.mode === "welcome";

  // 훅의 애니메이션이 안 끝났거나 OR 토큰 검사가 아직 안 끝났으면 계속 스플래시 노출
  const isEffectivelySplash =
    ui.mode === "normal" && (ui.isSplash || authCheckStatus === "pending");

  // 스플래시도 끝났고, 토큰 검사 결과 로그아웃 상태일 때만 로그인 버튼 노출
  const showLogin =
    ui.mode === "normal" &&
    !isEffectivelySplash &&
    authCheckStatus === "loggedOut";

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
          ) : isEffectivelySplash ? (
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
        ) : isEffectivelySplash ? (
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
              {!isAndroidApp() && (
                <AppleButton onClick={apple.login} disabled={apple.isPending} />
              )}
              <KakaoButton onClick={handleKakaoLogin} />
            </div>

            <Press
              as={Link}
              to="/mainpage"
              className="mt-3 flex flex-col text-center text-sm font-medium text-neutral-200 underline underline-offset-2"
            >
              로그인 없이 둘러보기
            </Press>
          </section>
        ) : null}
      </footer>
    </main>
  );
}
