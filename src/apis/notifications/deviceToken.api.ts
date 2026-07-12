import { axiosInstance } from "@/lib/axiosInstance";
import type {
  DeviceTokenRegisterRequest,
  DeviceTokenRegisterResponse,
  DeviceTokenUnregisterResponse,
} from "@/types/notification/deviceToken";

// 기기 토큰 등록/갱신 api
export async function registerDeviceToken(
  payload: DeviceTokenRegisterRequest,
): Promise<DeviceTokenRegisterResponse> {
  const res = await axiosInstance.post<DeviceTokenRegisterResponse>(
    "/notifications/device-tokens",
    payload,
  );
  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 기기 토큰 해제 api
export async function unregisterDeviceToken(
  token: string,
): Promise<DeviceTokenUnregisterResponse> {
  const res = await axiosInstance.delete<DeviceTokenUnregisterResponse>(
    "/notifications/device-tokens",
    { params: { token } },
  );
  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
