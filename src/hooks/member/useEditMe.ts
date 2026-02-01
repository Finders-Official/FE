import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { EditMeReqDto, MyPageDataDto } from "@/types/mypage/info";
import { ME_QUERY_KEY } from "./useMe";
import { editMe } from "@/apis/member";

type Response = ApiResponse<MyPageDataDto>;
type Variables = EditMeReqDto;
type TError = Error;
type TContext = unknown;

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms));
}

export function useEditMe(
  options?: Omit<
    UseMutationOptions<Response, TError, Variables, TContext>,
    "mutationFn"
  >,
) {
  const qc = useQueryClient();

  return useMutation<Response, TError, Variables, TContext>({
    mutationFn: (payload) => editMe(payload),

    onSuccess: async (data, variables, onMutateResult, context) => {
      const nextNick = variables.nickname?.trim();

      // UI 즉시 반영
      if (nextNick) {
        qc.setQueryData<MyPageDataDto>(ME_QUERY_KEY, (prev) => {
          if (!prev) return prev;

          if (prev.roleData.role === "USER") {
            return {
              ...prev,
              roleData: {
                ...prev.roleData,
                user: { ...prev.roleData.user, nickname: nextNick },
              },
            };
          }
          return prev;
        });
      }

      //stale 처리(나중에 자연스럽게 재검증)
      await qc.invalidateQueries({ queryKey: ME_QUERY_KEY });

      //refetch를 잠깐 늦춰서(서버 반영 기다림)
      void (async () => {
        await sleep(600); // 0.6초 delay
        await qc.refetchQueries({ queryKey: ME_QUERY_KEY, type: "all" });
      })();

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);
    },

    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);
    },

    ...options,
  });
}
