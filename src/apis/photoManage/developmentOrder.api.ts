import { axiosInstance } from "@/lib/axiosInstance";
import type {
  ApiResponse,
  ApiResponseWithSlice,
} from "@/types/common/apiResponse";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";
import type { ScanResult } from "@/types/photomanage/scanResult";

/**
 * 인화 안 함 확정
 */
export async function printSkip(developmentOrderId: number) {
  const res = await axiosInstance.post<ApiResponse<number>>(
    `/photos/development-orders/${developmentOrderId}/print/skip`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.success; // 성공 여부
}

/**
 * 스캔 결과 사진 목록 조회
 */
export async function getScanResults(
  developmentOrderId: number,
  pageParam = 0,
): Promise<ApiResponseWithSlice<ScanResult[]>> {
  const res = await axiosInstance.get<ApiResponseWithSlice<ScanResult[]>>(
    `/photos/development-orders/${developmentOrderId}/scan-results`,
    {
      params: {
        page: pageParam,
        size: PAGE_SIZE,
      },
    },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
