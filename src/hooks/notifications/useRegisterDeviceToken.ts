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
    ...options,
  });
}
