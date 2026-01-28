import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { editMe } from "@/apis/member";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { EditMeReqDto, MyPageDataDto } from "@/types/mypage/info";
import { ME_QUERY_KEY } from "./useMe";

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

      // ✅ 1) UI는 즉시 반영 (refetch가 옛 값을 가져와도 일단 화면은 최신처럼 보임)
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

      // ✅ 2) stale 처리(나중에 자연스럽게 재검증)
      await qc.invalidateQueries({ queryKey: ME_QUERY_KEY });

      // ✅ 3) refetch를 “바로” 하지 말고 잠깐 늦춰서(서버 반영 기다림)
      //    이게 핵심. 바로 refetch하면 옛 값으로 다시 덮어쓰는 경우가 많음.
      void (async () => {
        await sleep(600); // 0.6초 정도(필요하면 800~1200ms로)
        await qc.refetchQueries({ queryKey: ME_QUERY_KEY, type: "all" });
      })();

      // ✅ 4) 이제 이동 (이동할 때 캐시는 이미 nextNick으로 바뀐 상태)
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
