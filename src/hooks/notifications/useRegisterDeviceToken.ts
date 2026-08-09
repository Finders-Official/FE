import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { registerDeviceToken } from "@/apis/notifications";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { DeviceTokenRegisterRequest } from "@/types/notification/deviceToken";

type Response = ApiResponse<number>;
type Variables = DeviceTokenRegisterRequest;
type TError = Error;
type TContext = unknown;

export function useRegisterDeviceToken(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["notifications", "registerDeviceToken"],
    mutationFn: (payload) => registerDeviceToken(payload),
    // 등록은 registration 이벤트 한 번에만 실려 있어 재시도 경로가 따로 없다.
    // 여기서 실패하면 앱을 다시 켜기 전까지 푸시를 한 건도 받지 못하므로
    // 일시적인 5xx·네트워크 끊김은 흡수한다 (QueryClient 기본값은 retry: 0)
    retry: 2,
    ...options,
  });
}
