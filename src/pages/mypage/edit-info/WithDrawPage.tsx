import { CTA_Button } from "@/components/common";
import { Checkbox } from "@/components/common/CheckBox";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { NoticeCard } from "@/components/mypage";
import { useWithDrawMe } from "@/hooks/member";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

function getApiResponseCode(err: unknown): string | undefined {
  const e = err as AxiosError<ApiResponse<unknown>>;
  return e?.response?.data?.code;
}

export function WithDrawPage() {
  const navigate = useNavigate();

  const qc = useQueryClient();

  const toastTimerRef = useRef<number | null>(null);

  //체크박스 동의 상태
  const [agreed, setAgreed] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const showToastWithTimeout = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
      toastTimerRef.current = null;
    }, 2000);
  };

  const { mutate: withdraw, isPending } = useWithDrawMe({
    onSuccess: () => {
      tokenStorage.clear();
      qc.clear();
      navigate("/auth/login", { replace: true });
    },
    onError: (e) => {
      const code = getApiResponseCode(e);

      if (code === "MEMBER_400") {
        showToastWithTimeout("진행 중인 예약이 있어 탈퇴할 수 없어요.");
        return;
      }

      // 기타 에러 처리 정책 선택
      showToastWithTimeout("탈퇴 처리 중 오류가 발생했어요.");
    },
  });

  //체크박스 토글
  const handleAgreeChange = (nextChecked: boolean) => {
    setAgreed(nextChecked);
  };

  //CTA 클릭 시 로그인으로 리다이렉트
  const handleSubmit = () => {
    if (!agreed) return;
    withdraw();
  };

  return (
    <div className="relative flex h-full flex-1 flex-col">
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
          onClick={() => setShowDialog(true)}
        />
      </footer>
      <LoadingSpinner open={isPending} />
      <DialogBox
        title="탈퇴하기"
        description="정말 '파인더스'를 떠나시겠어요?"
        isOpen={showDialog}
        confirmText="탈퇴하기"
        cancelText="뒤로 가기"
        onCancel={() => setShowDialog(false)}
        onConfirm={handleSubmit}
      />
      <DialogBox
        title={toastMessage}
        description="진행 중인 작업이 모두 완료된 후에 탈퇴가 가능합니다!"
        isOpen={showToast}
        confirmButtonStyle="text"
        align="left"
        confirmText="확인"
        onConfirm={() => setShowToast(false)}
      />
    </div>
  );
}
