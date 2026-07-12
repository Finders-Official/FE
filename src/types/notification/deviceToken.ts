import type { ApiResponse } from "@/types/common/apiResponse";

export type DevicePlatform = "ANDROID" | "IOS" | "WEB";

export interface DeviceTokenRegisterRequest {
  token: string;
  platform: DevicePlatform;
}

export type DeviceTokenRegisterResponse = ApiResponse<number>;

export type DeviceTokenUnregisterResponse = ApiResponse<Record<string, never>>;
