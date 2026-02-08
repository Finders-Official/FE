import { CopyButton } from "@/components/common";
import type { LabAccountInfo } from "@/types/photomanage/transaction";

interface AccountInfoCardProps {
  accountInfo: LabAccountInfo;
}

export function AccountInfoCard({ accountInfo }: AccountInfoCardProps) {
  const { bankName, accountNumber, accountHolder } = accountInfo;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.875rem] leading-[1.55] tracking-[-0.0175rem] text-neutral-300">
        현상소 계좌 정보
      </p>
      <div className="bg-neutral-875 flex h-[3.375rem] items-center justify-between rounded-[0.625rem] px-4">
        <div className="flex items-center gap-3 text-[0.9375rem] leading-[1.55] tracking-[-0.01875rem] text-neutral-100">
          <span>{bankName}</span>
          <span>{accountNumber}</span>
          <span>{accountHolder}</span>
        </div>
        <CopyButton
          text={accountNumber}
          toastMessage="계좌번호가 클립보드에 복사되었습니다."
          className="flex items-center justify-center"
          iconClassName="h-4.5 w-4.5 text-neutral-200"
          ariaLabel="계좌번호 복사"
        />
      </div>
    </div>
  );
}
