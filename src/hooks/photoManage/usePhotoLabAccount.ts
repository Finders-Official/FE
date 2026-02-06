import { useQuery } from "@tanstack/react-query";
import { getPhotoLabAccount } from "@/apis/photoManage";
import type { LabAccountInfo } from "@/types/photomanage/transaction";

// 백엔드 필드명(bankAccountNumber, bankAccountHolder) → 프론트 필드명(accountNumber, accountHolder)으로 매핑
export function usePhotoLabAccount(developmentOrderId: number) {
  return useQuery({
    queryKey: ["photoManage", "labAccount", developmentOrderId],
    queryFn: () => getPhotoLabAccount(developmentOrderId),
    select: (res): LabAccountInfo => ({
      bankName: res.data.bankName,
      accountNumber: res.data.bankAccountNumber,
      accountHolder: res.data.bankAccountHolder,
    }),
  });
}
