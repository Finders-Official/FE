import { useEffect, useRef, useState } from "react";
import AppleButton from "../../components/AppleButton";
import KakaoButton from "../../components/KakaoButton";

export default function LoginPage() {
  const [isSplash, setIsSplash] = useState(true);
  const timerRef = useRef<number[]>([]);

  useEffect(() => {
    timerRef.current.push(
      window.setTimeout(() => {
        setIsSplash(false);
      }, 2000),
    );

    return () => {
      for (const id of timerRef.current) window.clearTimeout(id);
      timerRef.current = [];
    };
  }, []);
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      {/* 로고 영역 */}
      <section className="mt-60 flex animate-[finders-fade-in_1500ms_ease-in-out_forwards] flex-col items-center text-center">
        <img
          src="/MainLogo.svg"
          alt="Main Logo"
          className="h-28 w-42 sm:h-32 sm:w-46"
        />
        <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold text-neutral-100 sm:text-[3rem]">
          Finders
        </p>
        {!isSplash && (
          <p className="text-md mt-2 animate-[finders-fade-in_1500ms_ease-in-out_forwards] text-neutral-100 sm:text-base">
            뷰파인더 너머, 취향을 찾다
          </p>
        )}
      </section>

      {/* 버튼 영역: 아래로 내리기 */}
      {isSplash ? (
        <p className="text-md mt-auto animate-[finders-fade-in_1500ms_ease-in-out_forwards] pb-15 text-neutral-100 sm:text-base">
          뷰파인더 너머, 취향을 찾다
        </p>
      ) : (
        <section className="mt-auto w-full max-w-sm animate-[finders-fade-in_1500ms_ease-in-out_forwards] pb-15">
          <div className="flex flex-col gap-2">
            <AppleButton />
            <KakaoButton />
          </div>

          <button
            type="button"
            className="mt-3 w-full text-center text-sm font-medium text-neutral-200 underline underline-offset-2 active:scale-[0.99]"
          >
            로그인 없이 둘러보기
          </button>
        </section>
      )}
    </div>
  );
}

// main logo 부분은 default //
// // 회원가입 전에는 밑에 문구 + 로그인 버튼- 이미 회원가입 한 사람이 로그인 누르면 바로 홈으로 리다이렉 //
//회원가입 성공 후 성공문구 + 홈으로 이동 버튼 //
