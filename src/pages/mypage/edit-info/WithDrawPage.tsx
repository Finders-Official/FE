import { CTA_Button } from "@/components/common";
import { Checkbox } from "@/components/common/CheckBox";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { NoticeCard } from "@/components/mypage";
import {
  getWithdrawMessageByCode,
  type WithdrawBlockMessage,
} from "@/constants/mypage/withdrawErrorMessage.constant";
import { useWithDrawMe } from "@/hooks/member";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function getApiResponseCode(err: unknown): string | undefined {
  const e = err as AxiosError<ApiResponse<unknown>>;
  return e?.response?.data?.code;
}

type BlockDialogState = {
  isOpen: boolean;
  message: WithdrawBlockMessage;
};

export function WithDrawPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // 체크박스 동의 상태
  const [agreed, setAgreed] = useState(false);

  // 확인 다이얼로그(탈퇴 확인)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 에러 다이얼로그
  const [blockDialog, setBlockDialog] = useState<BlockDialogState>({
    isOpen: false,
    message: { title: "", description: "" },
  });

  const { mutate: withdraw, isPending } = useWithDrawMe({
    onSuccess: () => {
      tokenStorage.clear();
      qc.clear();
      navigate("/auth/login", { replace: true });
    },
    onError: (e) => {
      const code = getApiResponseCode(e);
      const msg = getWithdrawMessageByCode(code);

      // 확인 다이얼로그 닫고, 에러 다이얼로그 오픈
      setShowConfirmDialog(false);
      setBlockDialog({ isOpen: true, message: msg });
    },
  });

  // 체크박스 토글
  const handleAgreeChange = (nextChecked: boolean) => {
    setAgreed(nextChecked);
  };

  // CTA 클릭 시 확인 다이얼로그 오픈
  const handleClickWithdraw = () => {
    if (!agreed) return;
    setShowConfirmDialog(true);
  };

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

      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          size="xlarge"
          text="탈퇴하기"
          color={agreed ? "orange" : "black"}
          disabled={!agreed}
          onClick={handleClickWithdraw}
        />
      </footer>

      <LoadingSpinner open={isPending} />

      {/* 탈퇴 확인 다이얼로그 */}
      <DialogBox
        title="탈퇴하기"
        description="정말 '파인더스'를 떠나시겠어요?"
        isOpen={showConfirmDialog}
        confirmText="탈퇴하기"
        cancelText="뒤로 가기"
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleSubmit}
      />

      {/* 에러 코드 기반 안내 다이얼로그 */}
      <DialogBox
        title={blockDialog.message.title}
        description={blockDialog.message.description}
        isOpen={blockDialog.isOpen}
        confirmButtonStyle="text"
        align="left"
        confirmText="확인"
        onConfirm={() => setBlockDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
