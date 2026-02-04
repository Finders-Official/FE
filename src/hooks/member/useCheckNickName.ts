import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import { nicknameCheck } from "@/apis/member";
import type { NicknameCheckData } from "@/types/member";

type QueryKey = readonly ["users", "nicknameCheck", string];
type Data = ApiResponse<NicknameCheckData>;

export function useNicknameCheck(
  nickname: string,
  options?: Omit<
    UseQueryOptions<Data, Error, Data, QueryKey>,
    "queryKey" | "queryFn"
  >,
) {
  const trimmed = nickname.trim();

  return useQuery<Data, Error, Data, QueryKey>({
    queryKey: ["users", "nicknameCheck", trimmed],
    queryFn: () => nicknameCheck(trimmed),
    enabled: trimmed.length > 0, // 닉네임 입력 전엔 요청 안 함
    retry: 0,
    ...options,
  });
}
