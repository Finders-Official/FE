// src/pages/auth/OnBoardingPage/OnBoardingPage.tsx
import { formatMMSS } from "@/utils/time";
import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { useOnBoardingForm } from "@/hooks/auth/onBoarding";

export function OnBoardingPage() {
  const f = useOnBoardingForm();

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
          invalidText={f.nicknameStatusText || "닉네임을 입력해 주세요"}
          value={f.nickname}
          onChange={(e) => f.setNickname(e.target.value)}
          borderClass={f.nicknameBorderClass}
          textClass={f.nicknameTextClass}
        />

        <section className="flex gap-[1.25rem]">
          <InputForm
            name="전화번호"
            placeholder="'-'제외하고 입력"
            size="medium"
            borderClass={`focus:border-orange-500 ${
              f.lockPhoneForm ? "bg-neutral-850" : ""
            }`}
            value={f.phone}
            onChange={f.handlePhoneChange}
            disabled={f.lockPhoneForm}
          />
          <ActionButton
            type="button"
            text={f.isSending ? "재발송" : "인증하기"}
            onClick={f.handleSend}
            disabled={
              !f.phone ||
              f.isRequestingCode ||
              f.isCompleting ||
              f.lockPhoneForm
            }
            className={f.lockPhoneForm ? "bg-neutral-850 text-neutral-500" : ""}
          />
        </section>

        {f.isSending && (
          <>
            <section className="flex gap-[1.25rem]">
              <InputForm
                placeholder="인증번호 입력"
                size="medium"
                borderClass={`focus:border-orange-500 ${f.phoneBorderClass} ${
                  f.lockPhoneForm ? "bg-neutral-850" : ""
                }`}
                value={f.verifiedNumber}
                timer={
                  !f.lockPhoneForm ? (
                    <span className="text-sm text-orange-500">
                      {formatMMSS(Math.max(f.remainSec, 0))}
                    </span>
                  ) : null
                }
                onChange={f.handleVerifiedNumberChange}
                disabled={f.lockPhoneForm}
              />
              <ActionButton
                type="button"
                text={f.isConfirmingCode ? "확인중..." : "확인"}
                onClick={f.handleVerify}
                disabled={
                  !f.verifiedNumber ||
                  f.verifiedNumber.length !== 6 ||
                  f.isConfirmingCode ||
                  f.isCompleting
                }
                className={
                  f.lockPhoneForm ? "bg-neutral-850 text-neutral-500" : ""
                }
              />
            </section>
            <p className={`mt-2 px-2 text-sm ${f.phoneTextClass}`}>
              {f.phoneStatusText}
            </p>
          </>
        )}
      </form>

      <footer className="border-neutral-850 mx-auto mt-auto w-full max-w-sm border-t py-5">
        <CTA_Button
          text={f.isCompleting ? "가입 중..." : "가입하기"}
          color="orange"
          size="xlarge"
          disabled={!f.canSubmit || f.isCompleting}
          onClick={f.handleSubmit}
        />
      </footer>
    </div>
  );
}
