import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";
import { logout } from "@/apis/auth";

type Response = ApiResponse<Record<string, never>>;
type Variables = void;
type TError = Error;
type TContext = unknown;

export function useLogout(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  const qc = useQueryClient();

  // onSuccess/onError/onSettled를 options에서 "분리"해서
  // 나머지 옵션만 rest로 넣으면, 절대 내부 핸들러가 덮어써지지 않음.
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      const res = await logout();
      return res;
    },

    ...restOptions,

    onSuccess: (data, variables, onMutateResult, context) => {
      tokenStorage.clear();
      qc.clear();
      onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      tokenStorage.clear();
      qc.clear();
      onError?.(error, variables, onMutateResult, context);
    },

    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
}
