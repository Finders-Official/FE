// 배송지 조회 응답 (GET /users/addresses)
export type Address = {
  addressId: number;
  addressName: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
  createdAt: string;
};

// 배송지 추가 요청 (POST /users/addresses)
export interface CreateAddressRequest {
  addressName: string;
  zipcode: string;
  address: string;
  addressDetail?: string;
  isDefault: boolean;
}
