import { useEffect, useRef, useState } from "react";
import { KakaoButton } from "../../components/auth/KakaoButton";
import { Link } from "react-router";
import { CTA_Button } from "../../components/common/CTA_Button";

const SIGNED_UP_KEY = "finders:signedUp"; //추후에 변경 예정
const ANIM_KEY = "finders:loginAnimationPlayed";

export default function LoginPage() {
  const timerRef = useRef<number | null>(null);

  //초기 상태를 "스토리지" 기준으로 한 번에 결정 (splash 여부, 애니메이션 여부, 로그인 여부)
  // isSignedup은 전역상태로 뺼 예정이나, splash/애니메이션 여부는 이 페이지에서만 관리하면 되므로 로컬 상태로 둠
  const [ui, setUi] = useState(() => {
    if (typeof window === "undefined") {
      return { isSignedUp: false, isSplash: false, shouldAnimate: false };
    }

    const isSignedUp = localStorage.getItem(SIGNED_UP_KEY) === "1";
    const playedAnim = sessionStorage.getItem(ANIM_KEY) === "1";

    // 가입 완료면 스플래시/애니메이션 필요 없음 -> 바로 메인페이지
    if (isSignedUp) {
      return { isSignedUp: true, isSplash: false, shouldAnimate: false };
    }

    // 가입 안 했으면 최초 1회만 스플래시+애니메이션
    const shouldAnimate = !playedAnim;
    const isSplash = !playedAnim;

    return { isSignedUp: false, isSplash, shouldAnimate };
  });

  const { isSignedUp, isSplash, shouldAnimate } = ui;

  //최초 1회 애니메이션을 기록 (가입 안 한 유저 대상으로만)
  useEffect(() => {
    if (!shouldAnimate) return;
    sessionStorage.setItem(ANIM_KEY, "1");
  }, [shouldAnimate]);

  //스플래시 2초 후 본 화면 전환 (가입 안 한 최초 1회만)
  useEffect(() => {
    if (!shouldAnimate) return; // 이미 본 경우 스킵
    if (!isSplash) return;

    timerRef.current = window.setTimeout(() => {
      setUi((prev) => ({ ...prev, isSplash: false }));
      // shouldAnimate는 끄지 말 것 -> 2초 뒤에 나오는 컴포넌트들도 애니메이션 클래스가 필요함
    }, 2000);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [isSplash, shouldAnimate]);

  // 회원가입 완료 처리: 새로고침/뒤로가기에도 유지되게 저장
  const handleClick = () => {
    localStorage.setItem(SIGNED_UP_KEY, "1");
    setUi((prev) => ({
      ...prev,
      isSignedUp: true,
      isSplash: false,
      shouldAnimate: prev.shouldAnimate,
    }));
  };

  const headerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const taglineAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const footerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";

  // 상태가 바뀌는 순간에 애니메이션이 다시 안 도는 문제 방지(리마운트 트리거)
  const headerKey = isSignedUp
    ? "signedup-header"
    : isSplash
      ? "splash-header"
      : "login-header";
  const footerKey = isSignedUp
    ? "signedup-footer"
    : isSplash
      ? "splash-footer"
      : "login-footer";

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      {/* 로고 영역 */}
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

      {/* 버튼 영역 */}
      <footer className="mt-auto w-full pb-15">
        {isSignedUp ? (
          <div
            key={footerKey}
            className={`mx-auto flex w-full max-w-sm ${footerAnim}`}
          >
            <CTA_Button text="홈으로" link="/" color="orange" size="compact" />
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
              <KakaoButton onClick={handleClick} />
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

// main logo 부분은 default //
// 1. 회원가입 전에는 밑에 문구 + 로그인 버튼 이미 회원가입 한 사람이 로그인 누르면 소셜 로그인 진행 후 바로 홈으로 리다이렉 //
// 2. 회원가입 성공 후 성공문구 + 홈으로 이동 버튼 -> router 추후에 재설정 //
// 3. 로그인 없이 둘러보기 할 경우 홈으로 아동 -> router 추후에 재설정 //
// 4. 추가 정보 기입 후 서버 요청 200 오면 로그인 페이지로 이동 후 회원가입 문구 보여주고 홈으로 이동 버튼//

//카카오 디벨로퍼스에 API 키 등록
