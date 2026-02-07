import { useQuery } from "@tanstack/react-query";
import { getAddressList } from "@/apis/member";

export const ADDRESS_QUERY_KEY = ["member", "addresses"] as const;

export function useAddressList() {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: getAddressList,
    select: (res) => res.data,
  });
}
