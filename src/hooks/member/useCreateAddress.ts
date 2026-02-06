import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "@/apis/member";
import { ADDRESS_QUERY_KEY } from "./useAddressList";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
    },
  });
}
