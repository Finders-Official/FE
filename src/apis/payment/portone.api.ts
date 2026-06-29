import { axiosInstance } from "@/lib/axiosInstance";
import type {
  PortoneCompleteRequest,
  PortoneCompleteResponse,
  PortonePreRegisterRequest,
  PortonePreRegisterResponse,
} from "@/types/payment";

// PortOne 결제 사전등록 — 서버가 paymentId(UUID)와 결제 금액 반환
export async function preRegisterPortonePayment(
  request: PortonePreRegisterRequest,
): Promise<PortonePreRegisterResponse> {
  const res = await axiosInstance.post<PortonePreRegisterResponse>(
    "/payments/pre-register",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// PortOne 결제 완료 처리 — 서버가 포트원 조회·금액 검증 후 크레딧 충전
export async function completePortonePayment(
  request: PortoneCompleteRequest,
): Promise<PortoneCompleteResponse> {
  const res = await axiosInstance.post<PortoneCompleteResponse>(
    "/payments/complete",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
