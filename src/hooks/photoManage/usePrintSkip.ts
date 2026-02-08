import { printSkip } from "@/apis/photoManage/developmentOrder.api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function usePrintSkip() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (developmentOrderId: number) => printSkip(developmentOrderId),
    onSuccess: () => {
      navigate("/photoManage/splash");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
