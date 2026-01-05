import { useState } from "react";
import { InputForm } from "../../components/auth/InputForm";

export default function OnBoardingPage() {
  const [isVerifyed, setIsVerified] = useState(false);
  const [phone, SetPhone] = useState("");

  const handleVerify = () => {
    // 인증 로직 구현
    setIsVerified(true);
  };

  const buttonBgClass = phone ? "bg-orange-500" : "bg-neutral-875";
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
            value={phone}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 11);
              SetPhone(onlyDigits);
            }}
          />
          {/* 인증하기 버튼 누르고 발송되면 재발송으로 코멘트 바꾸기 */}
          <button
            type="button"
            className={`mt-auto h-[3.25rem] w-[5.25rem] rounded-lg active:scale-[0.99] active:bg-orange-500 ${buttonBgClass}`}
            onClick={handleVerify}
          >
            {isVerifyed ? "재발송" : "인증하기"}
          </button>
        </section>
      </main>
    </div>
  );
}

// 닉네임 중복 여부 -> 서버에서 소통 -> useDebounce나 usethrottle로 일정 시간 뒤에 검사
// 닉네임 형식 불일치 여부
// 전화번호 인증 방식 (나중에)

//닉네임: 이미 존재하는 닉네임입니다. -> 닉네임 존재 여부 api
// 2~8자 이내로 입력해주세요 / 사용가능한 아이디입니다.

//전화번호 인증
//1. 인증번호 발송 api
//2. 인증번호 확인 api

//모두 완료 후 회원가입 완료 상태 넘기고 라우팅 설정
