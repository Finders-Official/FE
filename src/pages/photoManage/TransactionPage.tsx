import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AccountInfoCard } from "@/components/photoManage/AccountInfoCard";
import { DepositorInput } from "@/components/photoManage/DepositorInput";
import { BankSelectDropdown } from "@/components/photoManage/BankSelectDropdown";
import { PaymentProofUpload } from "@/components/photoManage/PaymentProofUpload";
import { ToastItem, ToastList } from "@/components/common/ToastMessage";
import { CTA_Button } from "@/components/common";
import { CopyFillIcon } from "@/assets/icon";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useAuthStore } from "@/store/useAuth.store";
import { useMe } from "@/hooks/member";
import {
  usePhotoLabAccount,
  useConfirmDepositReceipt,
} from "@/hooks/photoManage";
import { useIssuePresignedUrl, useUploadToPresignedUrl } from "@/hooks/file";
import type { BankInfo } from "@/types/photomanage/transaction";

export default function TransactionPage() {
  const navigate = useNavigate();

  const storedMemberId = useAuthStore((s) => s.user?.memberId);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: meData } = useMe({ enabled: storedMemberId == null });
  const memberId = storedMemberId ?? meData?.member.memberId;

  useEffect(() => {
    if (!storedMemberId && meData) {
      setUser({
        memberId: meData.member.memberId,
        nickname:
          meData.roleData.role === "USER"
            ? meData.roleData.user.nickname
            : meData.member.name,
      });
    }
  }, [storedMemberId, meData, setUser]);

  const developmentOrderId = usePrintOrderStore((s) => s.developmentOrderId);
  const printOrderId = usePrintOrderStore((s) => s.printOrderId);
  const totalPrice = usePrintOrderStore((s) => s.totalPrice);
  const resetWorkflow = usePrintOrderStore((s) => s.resetWorkflow);

  const { data: labAccountInfo } = usePhotoLabAccount(developmentOrderId);
  const { mutateAsync: issuePresignedUrl } = useIssuePresignedUrl();
  const { mutateAsync: uploadToPresignedUrl } = useUploadToPresignedUrl();
  const { mutateAsync: confirmDeposit } = useConfirmDepositReceipt();

  const [showToast, setShowToast] = useState(false);
  const [depositorName, setDepositorName] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    depositorName.trim() !== "" && selectedBank !== null && proofImage !== null;

  const handleSubmit = async () => {
    if (
      !isFormValid ||
      !printOrderId ||
      !proofImage ||
      !selectedBank ||
      !memberId
    )
      return;

    setIsSubmitting(true);
    try {
      // 1. presigned URL 발급
      // TODO: 백엔드에서 DEPOSIT_RECEIPT 카테고리 추가 시 변경
      const { data: presigned } = await issuePresignedUrl({
        category: "TEMP_PUBLIC",
        fileName: proofImage.name,
        memberId,
      });

      // 2. S3 업로드
      await uploadToPresignedUrl({
        url: presigned.url,
        file: proofImage,
        contentType: proofImage.type,
      });

      // 3. 입금 확인 요청
      await confirmDeposit({
        printOrderId,
        request: {
          objectPath: presigned.objectPath,
          depositorName: depositorName.trim(),
          depositBankName: selectedBank.name,
        },
      });

      // 4. 워크플로우 초기화 + 이동
      resetWorkflow();
      navigate("/photoManage/main");
    } catch (err) {
      console.error("입금 확인 요청 실패:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAccount = async () => {
    if (!labAccountInfo) return;
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

        {labAccountInfo && (
          <div className="mt-4">
            <AccountInfoCard
              accountInfo={labAccountInfo}
              onCopy={handleCopyAccount}
            />
          </div>
        )}
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
          color={isFormValid && !isSubmitting ? "orange" : "black"}
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
        />
      </footer>

      {/* Toast */}
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
