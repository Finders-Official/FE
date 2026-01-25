import { KakaoButton } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { Link, useSearchParams } from "react-router";
import { useEffect, useMemo } from "react";

import { useLoginIntroUi } from "@/hooks/auth/login/useLoginIntroUi";
import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";

const WELCOME_ONCE_KEY = "finders:welcomeOnceShown";

export function LoginPage() {
  const [sp, setSp] = useSearchParams();
  const welcome = sp.get("welcome") === "1";

  const ui = useLoginIntroUi();

  // welcome=1이면 축하 화면을 강제로 띄우고, 한 번만 보여주기 처리
  const forceSignedUp = useMemo(() => {
    if (!welcome) return false;

    // 이미 보여줬으면 welcome=1 무시
    const shown = sessionStorage.getItem(WELCOME_ONCE_KEY) === "1";
    return !shown;
  }, [welcome]);

  useEffect(() => {
    if (!welcome) return;
    if (!forceSignedUp) return;

    sessionStorage.setItem(WELCOME_ONCE_KEY, "1");

    // URL 깔끔하게: /auth/login?welcome=1 -> /auth/login
    sp.delete("welcome");
    setSp(sp, { replace: true });
  }, [welcome, forceSignedUp, sp, setSp]);

  const isSignedUpView = forceSignedUp ? true : ui.isSignedUp;

  const handleKakaoLogin = () => {
    const url = buildKakaoAuthorizeUrl();
    console.log(url);
    window.location.assign(url);
  };

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
          {isSignedUpView ? (
            <div className={ui.headerAnim}>
              <p className="mt-3 text-[1.375rem] font-bold">
                회원가입을 축하드려요!
              </p>
              <p className="text-md mt-2 text-neutral-400">
                뷰파인더 너머 병국님의 취향을 찾아보세요
              </p>
            </div>
          ) : (
            <div>
              <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold sm:text-[3rem]">
                Finders
              </p>
              {!ui.isSplash && (
                <p className={`text-md mt-2 sm:text-base ${ui.taglineAnim}`}>
                  뷰파인더 너머, 취향을 찾다
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      <footer
        className={`mt-auto w-full py-5 ${isSignedUpView ? "border-neutral-850 border-t" : ""}`}
      >
        {isSignedUpView ? (
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
        ) : ui.isSplash ? (
          <p
            key={ui.footerKey}
            className={`text-md mt-auto text-center text-neutral-100 sm:text-base ${ui.footerAnim}`}
          >
            뷰파인더 너머, 취향을 찾다
          </p>
        ) : (
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
        )}
      </footer>
    </main>
  );
}
