import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { PrintOptionsResponse } from "@/types/photomanage/category";
import type {
  PrintQuoteRequest,
  PrintQuoteResponse,
  ScanResult,
} from "@/types/photomanage/printOrder";
import type {
  DepositReceiptConfirmRequest,
  PhotoLabAccountResponse,
} from "@/types/photomanage/transaction";

// 인화 옵션 목록 조회
export async function getPrintOptions(): Promise<
  ApiResponse<PrintOptionsResponse>
> {
  const res = await axiosInstance.get<ApiResponse<PrintOptionsResponse>>(
    "/photos/print/options",
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 인화 견적 조회
export async function quotePrintPrice(
  request: PrintQuoteRequest,
): Promise<ApiResponse<PrintQuoteResponse>> {
  const res = await axiosInstance.post<ApiResponse<PrintQuoteResponse>>(
    "/photos/print/quote",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 인화 주문 생성
export async function createPrintOrder(
  request: PrintQuoteRequest,
): Promise<ApiResponse<number>> {
  const res = await axiosInstance.post<ApiResponse<number>>(
    "/photos/print-orders",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 스캔 결과 사진 조회
export async function getScanResults(
  developmentOrderId: number,
  page = 0,
  size = 20,
): Promise<ApiResponse<ScanResult[]>> {
  const res = await axiosInstance.get<ApiResponse<ScanResult[]>>(
    `/photos/development-orders/${developmentOrderId}/scan-results`,
    { params: { page, size } },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 계좌 정보 조회
export async function getPhotoLabAccount(
  developmentOrderId: number,
): Promise<ApiResponse<PhotoLabAccountResponse>> {
  const res = await axiosInstance.get<ApiResponse<PhotoLabAccountResponse>>(
    `/photos/development-orders/${developmentOrderId}/photo-labs/account`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 입금 확인 요청
export async function confirmDepositReceipt(
  printOrderId: number,
  request: DepositReceiptConfirmRequest,
): Promise<ApiResponse<void>> {
  const res = await axiosInstance.post<ApiResponse<void>>(
    `/photos/print-orders/${printOrderId}/deposit-receipt`,
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
