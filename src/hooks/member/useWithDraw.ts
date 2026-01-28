// src/hooks/member/useWithDrawMe.ts
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";
import type { WithDrawResponse } from "@/types/mypage/info";
import { withDrawMe } from "@/apis/member/me.api";

type Response = ApiResponse<WithDrawResponse>;
type Variables = void;
type TError = Error;
type TContext = unknown;

export function useWithDrawMe(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  const qc = useQueryClient();

  // ✅ 콜백 분리: 내부 onSuccess/onError가 절대 options로 덮어써지지 않음
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["member", "withdrawMe"],
    mutationFn: async () => {
      const res = await withDrawMe();
      return res;
    },

    ...restOptions,

    onSuccess: (data, variables, onMutateResult, context) => {
      console.log("[useWithDrawMe] onSuccess - will clear tokens");
      tokenStorage.clear();
      qc.clear();
      onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      console.log("[useWithDrawMe] onError - will clear tokens");
      // 탈퇴 실패여도 “로컬은 로그아웃 처리”를 원하면 여기서도 clear 유지
      // 실패 시 토큰 유지하고 싶으면 아래 2줄 지우면 됨
      tokenStorage.clear();
      qc.clear();

      onError?.(error, variables, onMutateResult, context);
    },

    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
}
