import AppleButton from "../../components/AppleButton";
import KakaoButton from "../../components/KakaoButton";

export default function LoginPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      {/* 로고 영역 */}
      <section className="mt-60 flex flex-col items-center text-center">
        <img
          src="/MainLogo.svg"
          alt="Main Logo"
          className="h-24 w-38 sm:h-28 sm:w-42"
        />
        <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold text-neutral-100 sm:text-[3rem]">
          Finders
        </p>
        <p className="mt-2 text-sm text-neutral-100 sm:text-base">
          뷰파인더 너머, 취향을 찾다
        </p>
      </section>

      {/* 버튼 영역: 아래로 내리기 */}
      <section className="mt-auto w-full max-w-sm pb-15">
        <div className="flex flex-col gap-4">
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
    </div>
  );
}

// main logo 부분은 default //
// // 회원가입 전에는 밑에 문구 + 로그인 버튼- 이미 회원가입 한 사람이 로그인 누르면 바로 홈으로 리다이렉 //
//회원가입 성공 후 성공문구 + 홈으로 이동 버튼 //
