import { KakaoButton } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { Link } from "react-router";

import { useLoginIntroUi } from "@/hooks/auth/useLoginIntroUi";
import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";

export function LoginPage() {
  const {
    isSignedUp,
    isSplash,
    headerKey,
    footerKey,
    headerAnim,
    taglineAnim,
    footerAnim,
  } = useLoginIntroUi();

  const handleKakaoLogin = () => {
    window.location.assign(buildKakaoAuthorizeUrl());
  };

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <header
        className={`mt-60 flex flex-col items-center text-center ${headerAnim}`}
      >
        <img
          src="/MainLogo.svg"
          alt="Main Logo"
          className="h-28 w-42 sm:h-32 sm:w-46"
        />

        <div key={headerKey}>
          {isSignedUp ? (
            <div className={headerAnim}>
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
              {!isSplash && (
                <p className={`text-md mt-2 sm:text-base ${taglineAnim}`}>
                  뷰파인더 너머, 취향을 찾다
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      <footer
        className={`mt-auto w-full py-5 ${isSignedUp ? "border-neutral-850 border-t" : ""}`}
      >
        {isSignedUp ? (
          <div
            key={footerKey}
            className={`mx-auto flex w-full max-w-sm ${footerAnim}`}
          >
            <CTA_Button
              text="홈으로"
              link="../mainpage"
              color="orange"
              size="compact"
            />
          </div>
        ) : isSplash ? (
          <p
            key={footerKey}
            className={`text-md mt-auto text-center text-neutral-100 sm:text-base ${footerAnim}`}
          >
            뷰파인더 너머, 취향을 찾다
          </p>
        ) : (
          <section key={footerKey} className={`mx-auto max-w-sm ${footerAnim}`}>
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
