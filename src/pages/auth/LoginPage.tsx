import { useEffect, useRef, useState } from "react";
import KakaoButton from "../../components/auth/KakaoButton";
import { Link } from "react-router";
import { Button } from "../../components/common/Button";

export default function LoginPage() {
  const [isSplash, setIsSplash] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const key = "finders:loginAnimationPlayed";
  // 애니메이션 1회 재생 제어
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    const played = sessionStorage.getItem(key) === "1";
    return !played;
  });

  useEffect(() => {
    if (shouldAnimate) {
      sessionStorage.setItem(key, "1");
    }
  }, [shouldAnimate, key]);
  const timerRef = useRef<number | null>(null);

  const hanldeClick = () => {
    setIsSignedUp(true);
  };

  useEffect(() => {
    if (!isSplash) return;

    timerRef.current = window.setTimeout(() => {
      setIsSplash(false);
      setShouldAnimate(false);
    }, 2000);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = null;
    };
  }, [isSplash]);

  const headerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const taglineAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const footerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      {/* 로고 영역 */}
      <header
        className={`mt-60 flex flex-col items-center text-center ${headerAnim}`}
      >
        <img
          src="../public/MainLogo.svg"
          alt="Main Logo"
          className="h-28 w-42 sm:h-32 sm:w-46"
        />

        {isSignedUp ? (
          <div>
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
      </header>

      {/* 버튼 영역 */}
      <footer className="mt-auto w-full pb-15">
        {isSignedUp ? (
          <div className={`mx-auto flex w-full max-w-sm ${footerAnim}`}>
            <Button text="홈으로" link="/" color="orange" size="compact" />
          </div>
        ) : isSplash ? (
          <p
            className={`text-md mt-auto text-center text-neutral-100 sm:text-base ${footerAnim}`}
          >
            뷰파인더 너머, 취향을 찾다
          </p>
        ) : (
          <section className={`mx-auto max-w-sm ${footerAnim}`}>
            <div className="flex flex-col gap-2">
              <KakaoButton onClick={hanldeClick} />
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
// 2. 회원가입 성공 후 성공문구 + 홈으로 이동 버튼 //
// 3. 로그인 없이 둘러보기 할 경우 홈으로 아동 //
// 4. 추가 정보 기입 후 서버 요청 200 오면 로그인 페이지로 이동 후 회원가입 문구 보여주고 홈으로 이동 버튼//

//카카오 디벨로퍼스에 API 키 등록
