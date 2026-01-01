import { InputForm } from "../../components/auth/InputForm";

export default function OnBoardingPage() {
  return (
    <div className="mt-[3.4375rem] w-full">
      <header className="pt-[2.5rem]">
        <p className="text-[1rem] font-normal">소셜 로그인 연동한 정보 중</p>
        <p className="text-[1.375rem] font-semibold">
          필요한 정보를 더 입력해주세요
        </p>
      </header>
      <main className="mt-[2.5rem] flex flex-col gap-[1.5rem]">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
        />
        <section className="flex justify-between">
          <InputForm
            name="전화번호"
            placeholder="'-'제외하고 입력"
            size="medium"
            className="focus:border-orange-500"
          />
          <button className="bg-neutral-875 mt-auto h-[3.25rem] w-[5.25rem] rounded-lg active:scale-[0.99] active:bg-orange-500">
            인증하기
          </button>
        </section>
      </main>
    </div>
  );
}
