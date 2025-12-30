import { useEffect, useRef, useState } from "react";
import AppleButton from "../../components/auth/AppleButton";
import KakaoButton from "../../components/auth/KakaoButton";
import { Link } from "react-router";
import { Button } from "../../components/common/Button";

export default function LoginPage() {
  const [isSplash, setIsSplash] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const timerRef = useRef<number | null>(null);

  const hanldeClick = () => {
    setIsSignedUp(true);
  };

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setIsSplash(false);
    }, 2000);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = null;
    };
  }, []);

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      {/* 로고 영역 */}
      <header className="mt-60 flex animate-[finders-fade-in_1500ms_ease-in-out_forwards] flex-col items-center text-center">
        <img
          src="/MainLogo.svg"
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
              <p className="text-md mt-2 animate-[finders-fade-in_1500ms_ease-in-out_forwards] sm:text-base">
                뷰파인더 너머, 취향을 찾다
              </p>
            )}
          </div>
        )}
      </header>

      {/* 버튼 영역: 아래로 내리기 */}
      <footer className="mt-auto w-full pb-15">
        {isSignedUp ? (
          <div className="mx-auto w-full max-w-sm animate-[finders-fade-in_1500ms_ease-in-out_forwards]">
            <Button text="홈으로" link="/" color="orange" />
          </div>
        ) : isSplash ? (
          <p className="text-md mt-auto animate-[finders-fade-in_1500ms_ease-in-out_forwards] text-center text-neutral-100 sm:text-base">
            뷰파인더 너머, 취향을 찾다
          </p>
        ) : (
          <section className="mx-auto max-w-sm animate-[finders-fade-in_1500ms_ease-in-out_forwards]">
            <div className="flex flex-col gap-2">
              <AppleButton onClick={hanldeClick} />
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
