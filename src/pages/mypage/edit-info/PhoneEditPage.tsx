import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { formatMMSS } from "@/utils/time";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function PhoneEditPage() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [verifiedNumber, setVerifiedNumber] = useState("");

  //타이머 설정
  const [remainSec, setRemainSec] = useState(0);

  const color = isVerified ? "orange" : "black";

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

  const handleSubmit = () => {
    navigate("/mypage/edit-info", {
      replace: true,
      state: { toast: "전화번호를 변경했어요" },
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <form className="py-6">
        <section className="flex gap-[1.25rem]">
          <InputForm
            name="전화번호"
            placeholder="'-'제외하고 입력"
            size="medium"
            className="focus:border-orange-500"
            value={phone}
            onChange={(e) => handlePhoneChange(e)}
          />
          {/* 인증하기 버튼 누르고 발송되면 재발송으로 코멘트 바꾸기 */}
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
              onChange={(e) => handleVerifiedNumberChange(e)}
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
      <footer className="border-neutral-850 mt-auto border-t px-4 py-5">
        <CTA_Button
          size="xlarge"
          text="변경 완료"
          color={color}
          onClick={handleSubmit}
          disabled={!isVerified}
        />
      </footer>
    </div>
  );
}
