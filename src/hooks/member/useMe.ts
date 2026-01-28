// src/hooks/member/useMe.ts (경로는 너 프로젝트 컨벤션에 맞춰)
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { MyPageDataDto } from "@/types/mypage/info";
import { me } from "@/apis/member";

export type MeResponse = ApiResponse<MyPageDataDto>;
type Data = MyPageDataDto;

export const ME_QUERY_KEY = ["member", "me"] as const; // 얘네도 타입으로 빼야하나..

export function useMe(
  options?: Omit<
    UseQueryOptions<MeResponse, Error, Data, typeof ME_QUERY_KEY>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<MeResponse, Error, Data, typeof ME_QUERY_KEY>({
    queryKey: ME_QUERY_KEY,
    queryFn: () => me(),
    select: (res) => res.data,
    staleTime: 1000 * 30 * 60,
    refetchInterval: 1000 * 6 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...options,
  });
}
