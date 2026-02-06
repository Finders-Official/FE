import { useMutation } from "@tanstack/react-query";
import { quotePrintPrice } from "@/apis/photoManage";

export function usePrintQuote() {
  return useMutation({
    mutationFn: quotePrintPrice,
  });
}
