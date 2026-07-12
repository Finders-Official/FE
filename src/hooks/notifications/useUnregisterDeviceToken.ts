import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { unregisterDeviceToken } from "@/apis/notifications";
import type { ApiResponse } from "@/types/common/apiResponse";

type Response = ApiResponse<Record<string, never>>;
type Variables = string; // 해제할 FCM 토큰
type TError = Error;
type TContext = unknown;

export function useUnregisterDeviceToken(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["notifications", "unregisterDeviceToken"],
    mutationFn: (token) => unregisterDeviceToken(token),
    ...options,
  });
}
