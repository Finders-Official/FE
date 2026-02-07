import { useMutation } from "@tanstack/react-query";
import { createPrintOrder } from "@/apis/photoManage";

export function useCreatePrintOrder() {
  return useMutation({
    mutationFn: createPrintOrder,
  });
}
