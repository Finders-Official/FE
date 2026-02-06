import { useQuery } from "@tanstack/react-query";
import { getPrintOptions } from "@/apis/photoManage";

export function usePrintOptions() {
  return useQuery({
    queryKey: ["photoManage", "printOptions"],
    queryFn: getPrintOptions,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
