import { KakaoButton } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { Link, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";
import { useLoginIntroUi } from "@/hooks/auth/login";
import { useAuthStore } from "@/store/useAuth.store";

const WELCOME_NONCE_SHOWN_KEY = "finders:welcomeNonceShown";
const WELCOME_ONCE_FALLBACK_KEY = "finders:welcomeOnceShown";

export function LoginPage() {
  const [sp, setSp] = useSearchParams();

  const nickname = useAuthStore((s) => s.user?.memberId);

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

  const handleKakaoLogin = () => {
    const url = buildKakaoAuthorizeUrl();
    window.location.assign(url);
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
              link="../mainpage"
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
