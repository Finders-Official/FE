import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { formatMMSS } from "@/utils/time";
import { useOnBoardingForm } from "@/hooks/auth/onBoarding";
import { useEditMe, useMe } from "@/hooks/member";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";

export function PhoneEditPage() {
  const navigate = useNavigate();

  const { data: meData } = useMe();
  const currentPhone = meData?.member.phone ?? "";

  const f = useOnBoardingForm({ phonePurpose: "MY_PAGE" });
  const didInit = useRef(false);

  //최초 진입 시 현재 전화번호 주입 + 인증상태 리셋
  useEffect(() => {
    if (didInit.current) return;
    if (!currentPhone) return;

    const id = window.setTimeout(() => {
      f.initPhone(currentPhone);
      didInit.current = true;
    }, 0);

    return () => window.clearTimeout(id);
  }, [currentPhone, f]);

  const { mutate: edit, isPending: isEditing } = useEditMe({
    onSuccess: () => {
      navigate("/mypage/edit-info", {
        replace: true,
        state: { toast: "전화번호를 변경했어요" },
      });
    },
    onError: (e) => console.error(e.message),
  });

  const phoneChanged = useMemo(() => {
    const next = (f.phone ?? "").trim();
    const cur = (currentPhone ?? "").replace(/\D/g, "");
    return next.length > 0 && next !== cur;
  }, [f.phone, currentPhone]);

  //제출 가능 조건: (변경됨) + (인증완료) + (토큰 있음) + (수정 중 아님)
  const canSubmit = useMemo(() => {
    return phoneChanged && f.isVerified && !!f.verifiedPhoneToken && !isEditing;
  }, [phoneChanged, f.isVerified, f.verifiedPhoneToken, isEditing]);

  const color = canSubmit ? "orange" : "black";

  const handleSubmit = () => {
    if (!canSubmit) return;

    edit({
      phone: f.phone,
      verifiedPhoneToken: f.verifiedPhoneToken ?? undefined,
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
            value={f.phone}
            onChange={f.handlePhoneChange}
          />
          <ActionButton
            type="button"
            text={f.isSending ? "재발송" : "인증하기"}
            onClick={f.handleSend}
            disabled={!phoneChanged || f.phone.length < 10}
          />
        </section>

        {f.isSending && (
          <section className="flex gap-[1.25rem]">
            <InputForm
              placeholder="인증번호 입력"
              size="medium"
              className="focus:border-orange-500"
              value={f.verifiedNumber}
              timer={
                <span className="text-sm text-orange-500">
                  {formatMMSS(Math.max(f.remainSec, 0))}
                </span>
              }
              onChange={f.handleVerifiedNumberChange}
            />
            <ActionButton
              type="button"
              text="확인"
              onClick={f.handleVerify}
              disabled={f.verifiedNumber.length !== 6 || f.remainSec <= 0}
            />
          </section>
        )}
      </form>

      <footer className="border-neutral-850 mt-auto border-t px-4 py-5">
        <CTA_Button
          size="xlarge"
          text={isEditing ? "변경 중..." : "변경 완료"}
          color={color}
          onClick={handleSubmit}
          disabled={!canSubmit}
        />
      </footer>
    </div>
  );
}
