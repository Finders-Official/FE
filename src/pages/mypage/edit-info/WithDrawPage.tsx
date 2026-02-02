import { CTA_Button } from "@/components/common";
import { Checkbox } from "@/components/common/CheckBox";
import { NoticeCard } from "@/components/mypage";
import { useState } from "react";
import { useNavigate } from "react-router";

export function WithDrawPage() {
  const navigate = useNavigate();

  //체크박스 동의 상태
  const [agreed, setAgreed] = useState(false);

  //체크박스 토글
  const handleAgreeChange = (nextChecked: boolean) => {
    setAgreed(nextChecked);
  };

  //CTA 클릭 시 로그인으로 리다이렉트
  const handleSubmit = () => {
    if (!agreed) return;
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <main className="py-10">
        <section>
          <p className="text-[1rem] leading-[155%] font-normal tracking-[-0.02rem]">
            회원 탈퇴 전
          </p>
          <p className="text-[1.375rem] leading-[128%] font-semibold tracking-[-0.0275rem]">
            아래 유의사항을 확인해 주세요
          </p>
        </section>

        <NoticeCard />

        <section className="mt-4 flex gap-2 px-2">
          <Checkbox checked={agreed} onChange={handleAgreeChange} />
          <p className="text-[0.9375rem] leading-[155%] font-normal tracking-[-0.01875rem]">
            탈퇴 시 유의사항을 모두 확인하였습니다.
          </p>
        </section>
      </main>

      <footer className="border-neutral-850 mt-auto border-t px-4 py-5">
        <CTA_Button
          size="xlarge"
          text="탈퇴하기"
          color={agreed ? "orange" : "black"}
          disabled={!agreed}
          onClick={handleSubmit}
        />
      </footer>
    </div>
  );
}
