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

// 동기화 지연을 위한 함수
function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms));
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

// 타입 가드 함수
function isApiResponseLike(x: unknown): x is ApiResponse<MyPageDataDto> {
  if (!isRecord(x)) return false;
  return "data" in x;
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

    onSuccess: async (res, variables, onMutateResult, context) => {
      const nextNick = variables.nickname?.trim();
      const nextProfileImage = variables.profileImageUrl?.trim();

      if (nextNick || nextProfileImage) {
        qc.setQueryData(ME_QUERY_KEY, (prev) => {
          if (!prev) return prev;

          // dto로 ApiResponse or MyPageDataDto가 들어오든 타입 에러를 잡아줌
          const dto = isApiResponseLike(prev)
            ? prev.data
            : (prev as MyPageDataDto);

          const roleData = dto.roleData;
          if (!roleData || roleData.role !== "USER") return prev;

          const user = roleData.user;
          const nextUser = { ...user };

          if (nextNick) nextUser.nickname = nextNick;
          if (nextProfileImage) nextUser.profileImage = nextProfileImage;

          const nextDto: MyPageDataDto = {
            ...dto,
            roleData: {
              ...roleData,
              user: nextUser,
            },
          };

          if (isApiResponseLike(prev)) {
            return { ...prev, data: nextDto };
          }
          return nextDto;
          // prettier-ignore
        });
      }

      await qc.invalidateQueries({ queryKey: ME_QUERY_KEY });

      void (async () => {
        await sleep(600);
        await qc.refetchQueries({ queryKey: ME_QUERY_KEY, type: "all" });
      })();

      options?.onSuccess?.(res, variables, onMutateResult, context);
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
