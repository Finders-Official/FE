import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmReceipt } from "@/apis/photoManage";

export function useConfirmReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (developmentOrderId: number) =>
      confirmReceipt(developmentOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWork"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
