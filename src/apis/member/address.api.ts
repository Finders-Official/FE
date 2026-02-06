import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  Address,
  CreateAddressRequest,
} from "@/types/photomanage/address";

// 배송지 목록 조회
export async function getAddressList(): Promise<ApiResponse<Address[]>> {
  const res =
    await axiosInstance.get<ApiResponse<Address[]>>("/users/addresses");

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 배송지 추가
export async function createAddress(
  request: CreateAddressRequest,
): Promise<ApiResponse<Address>> {
  const res = await axiosInstance.post<ApiResponse<Address>>(
    "/users/addresses",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
