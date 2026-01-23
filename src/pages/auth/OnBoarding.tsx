import { useEffect, useMemo, useState } from "react";
import { formatMMSS } from "@/utils/time";
import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { useDebouncedValue } from "@/hooks/common";
import { useNicknameCheck } from "@/hooks/member";

function isValidNickname(n: string) {
  // 2~8자, 한글/영문/숫자만 (원하면 정규식 수정)
  return /^[a-zA-Z0-9가-힣]{2,8}$/.test(n);
}

export function OnBoardingPage() {
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [verifiedNumber, setVerifiedNumber] = useState("");

  const [remainSec, setRemainSec] = useState(0);

  // ✅ 닉네임 디바운스(예: 400ms)
  const debouncedNickname = useDebouncedValue(nickname, 400);
  const nicknameTrimmed = useMemo(
    () => debouncedNickname.trim(),
    [debouncedNickname],
  );
  const nicknameValid = useMemo(
    () => isValidNickname(nicknameTrimmed),
    [nicknameTrimmed],
  );

  // ✅ 디바운스된 값 + 유효할 때만 중복 체크 요청
  const {
    data: nicknameRes,
    isFetching: isCheckingNickname,
    error: nicknameError,
  } = useNicknameCheck(nicknameTrimmed, {
    enabled: nicknameValid,
    retry: 0,
  });

  const nicknameAvailable = nicknameRes?.data.available ?? false;

  //인증번호 발송 처리
  const handleSend = () => {
    setIsSending(true);
    setRemainSec(180);
    // 인증번호 발송 로직 구현
  };

  //전화번호 입력 처리
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
  };

  //인증번호 입력 처리
  const handleVerifiedNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerifiedNumber(digits);
  };

  //타이머 카운트다운 처리
  useEffect(() => {
    if (!isSending) return;
    if (remainSec <= 0) return;

    const id = setTimeout(() => {
      setRemainSec((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(id);
  }, [isSending, remainSec]);

  //인증번호 확인 처리
  const handleVerify = () => {
    if (remainSec <= 0) return;
    setIsVerified(true);
  };

  // ✅ 닉네임 입력 상태 문구(원하면 InputForm에 props로 연결)
  const nicknameStatusText =
    nickname.length === 0
      ? ""
      : !nicknameValid
        ? "2~8자, 한글/영문/숫자만 가능해요."
        : isCheckingNickname
          ? "닉네임 확인 중..."
          : nicknameError
            ? "닉네임 확인에 실패했어요."
            : nicknameAvailable
              ? "사용 가능한 닉네임이에요."
              : "이미 사용 중인 닉네임이에요.";

  // ✅ 가입하기 버튼 활성 조건 예시(원하는 조건으로 수정)
  const canSubmit = isVerified && nicknameValid && nicknameAvailable;

  return (
    <div className="flex w-full flex-col items-center">
      <header className="w-full max-w-sm pt-[2.5rem]">
        <p className="text-[1rem] font-normal">소셜 로그인 연동한 정보 중</p>
        <p className="text-[1.375rem] font-semibold">
          필요한 정보를 더 입력해주세요
        </p>
      </header>

      <form className="mt-[2.5rem] flex flex-col">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
          // ✅ invalidText를 “고정 문구” 대신 상태 기반으로 쓰고 싶으면 이렇게
          invalidText={nicknameStatusText || "잘못된 닉네임입니다."}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <section className="flex gap-[1.25rem]">
          <InputForm
            name="전화번호"
            placeholder="'-'제외하고 입력"
            size="medium"
            className="focus:border-orange-500"
            value={phone}
            onChange={handlePhoneChange}
          />
          <ActionButton
            type="button"
            text={isSending ? "재발송" : "인증하기"}
            onClick={handleSend}
            disabled={!phone}
          />
        </section>

        {isSending && (
          <section className="flex gap-[1.25rem]">
            <InputForm
              placeholder="인증번호 입력"
              size="medium"
              className="focus:border-orange-500"
              value={verifiedNumber}
              timer={
                <span className="text-sm text-orange-500">
                  {formatMMSS(Math.max(remainSec, 0))}
                </span>
              }
              onChange={handleVerifiedNumberChange}
            />
            <ActionButton
              type="button"
              text="확인"
              onClick={handleVerify}
              disabled={!verifiedNumber}
            />
          </section>
        )}
      </form>

      {isVerified && (
        <footer className="border-neutral-850 mx-auto mt-auto w-full max-w-sm border-t py-5">
          <CTA_Button
            text="가입하기"
            color="orange"
            size="xlarge"
            disabled={!canSubmit}
          />
        </footer>
      )}
    </div>
  );
}

// 닉네임 중복 여부 -> 서버에서 소통 -> useDebounce나 usethrottle로 일정 시간 뒤에 검사
// 닉네임 형식 불일치 여부

//닉네임: 이미 존재하는 닉네임입니다. -> 닉네임 존재 여부 api
// 2~8자 이내로 입력해주세요 / 사용가능한 아이디입니다.

// api 연동
//1. 닉네임 중복 검사 api ->
//2. 인증번호 발송 api -> sendOtpMutation
//3. 인증번호 확인 api -> verifyOtpMutation
//4. 가입하기 최종 폼 제출 api -> onSubmit으로

//모두 완료 후 회원가입 완료 상태 넘기고 라우팅 설정

//localStorage.setItem("finders:signedUp", "1");
//navigate("/auth/login?welcome=1", { replace: true });
