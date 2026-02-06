import { useMutation } from "@tanstack/react-query";
import { confirmDepositReceipt } from "@/apis/photoManage";
import type { DepositReceiptConfirmRequest } from "@/types/photomanage/transaction";

interface ConfirmDepositParams {
  printOrderId: number;
  request: DepositReceiptConfirmRequest;
}

export function useConfirmDepositReceipt() {
  return useMutation({
    mutationFn: ({ printOrderId, request }: ConfirmDepositParams) =>
      confirmDepositReceipt(printOrderId, request),
  });
}
