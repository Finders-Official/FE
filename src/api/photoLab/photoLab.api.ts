import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PhotoLabItem,
  PhotoLabListParams,
  PhotoLabFavoriteStatus,
  PagedApiResponse,
} from "@/types/photoLab";
import type { PopularLab } from "@/types/photoLabSearch";

// 현상소 목록 조회
export async function getPhotoLabList(
  params: PhotoLabListParams,
): Promise<PagedApiResponse<PhotoLabItem[]>> {
  const res = await axiosInstance.get<PagedApiResponse<PhotoLabItem[]>>(
    "/photo-labs",
    { params },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 즐겨찾기 추가
export async function addFavorite(
  photoLabId: number,
): Promise<ApiResponse<PhotoLabFavoriteStatus>> {
  const res = await axiosInstance.post<ApiResponse<PhotoLabFavoriteStatus>>(
    `/photo-labs/${photoLabId}/favorites`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 즐겨찾기 삭제
export async function removeFavorite(
  photoLabId: number,
): Promise<ApiResponse<PhotoLabFavoriteStatus>> {
  const res = await axiosInstance.delete<ApiResponse<PhotoLabFavoriteStatus>>(
    `/photo-labs/${photoLabId}/favorites`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 인기 현상소 조회
export async function getPopularPhotoLabs(): Promise<
  ApiResponse<PopularLab[]>
> {
  const res = await axiosInstance.get<ApiResponse<PopularLab[]>>(
    "/photo-labs/popular",
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
