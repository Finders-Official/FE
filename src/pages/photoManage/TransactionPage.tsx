import { useState } from "react";
import { useLocation } from "react-router";
import { AccountInfoCard } from "@/components/photoManage/AccountInfoCard";
import { ToastItem, ToastList } from "@/components/common/ToastMessage";
import { CopyFillIcon } from "@/assets/icon";
import type { TransactionRouteState } from "@/types/photomanage/transaction";

// 테스트용 mock 데이터
const MOCK_STATE: TransactionRouteState = {
  photoLabId: 1,
  printOrderId: 55,
  totalPrice: 8000,
  receiptMethod: "PICKUP",
  labAccountInfo: {
    bankName: "우리은행",
    accountNumber: "2739749381409821414",
    accountHolder: "박*상",
  },
};

export default function TransactionPage() {
  const location = useLocation();
  const routeState = (location.state as TransactionRouteState) || MOCK_STATE;
  const { totalPrice, labAccountInfo } = routeState;

  const [showToast, setShowToast] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(labAccountInfo.accountNumber);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* 금액 안내 */}
      <section className="py-[1.875rem]">
        <h1 className="text-[1.25rem] leading-[1.28] font-semibold tracking-[-0.025rem] text-neutral-100">
          아래 계좌로 {totalPrice.toLocaleString()}원을 입금해주세요
        </h1>

        <div className="mt-4">
          <AccountInfoCard
            accountInfo={labAccountInfo}
            onCopy={handleCopyAccount}
          />
        </div>
      </section>

      {/* Toast, http에선 IOS 클립보드 복사 안됨 */}
      {showToast && (
        <ToastList>
          <ToastItem
            message="계좌번호가 클립보드에 복사되었습니다."
            icon={<CopyFillIcon className="h-5 w-5 text-orange-500" />}
          />
        </ToastList>
      )}
    </div>
  );
}
