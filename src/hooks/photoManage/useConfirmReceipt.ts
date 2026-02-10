import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { confirmReceipt } from "@/apis/photoManage";

export function useConfirmReceipt() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (developmentOrderId: number) =>
      confirmReceipt(developmentOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWork"] });
      navigate("/photoManage/splash");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
