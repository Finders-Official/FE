import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AccountInfoCard } from "@/components/photoManage/AccountInfoCard";
import { DepositorInput } from "@/components/photoManage/DepositorInput";
import { BankSelectDropdown } from "@/components/photoManage/BankSelectDropdown";
import { PaymentProofUpload } from "@/components/photoManage/PaymentProofUpload";
import { ToastItem, ToastList } from "@/components/common/ToastMessage";
import { CTA_Button } from "@/components/common";
import { CopyFillIcon } from "@/assets/icon";
import type {
  TransactionRouteState,
  BankInfo,
} from "@/types/photomanage/transaction";

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
  const navigate = useNavigate();
  const routeState = (location.state as TransactionRouteState) || MOCK_STATE;
  const { totalPrice, labAccountInfo } = routeState;

  const [showToast, setShowToast] = useState(false);
  const [depositorName, setDepositorName] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  // 폼 유효성 검사
  const isFormValid =
    depositorName.trim() !== "" && selectedBank !== null && proofImage !== null;

  const handleSubmit = () => {
    if (!isFormValid) return;
    // 나중에 여기서 API 호출
    navigate("/photoManage/main");
  };

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

      {/* 입금자 입력 */}
      <DepositorInput value={depositorName} onChange={setDepositorName} />

      {/* 은행 선택 */}
      <div className="mt-4">
        <BankSelectDropdown value={selectedBank} onChange={setSelectedBank} />
      </div>

      {/* 입금 증빙 업로드 */}
      <PaymentProofUpload
        preview={proofPreview}
        onFileSelect={(file, preview) => {
          setProofImage(file);
          setProofPreview(preview);
        }}
      />

      {/* CTA 버튼 */}
      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          text="인화 신청 완료"
          size="xlarge"
          color={isFormValid ? "orange" : "black"}
          disabled={!isFormValid}
          onClick={handleSubmit}
        />
      </footer>

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
