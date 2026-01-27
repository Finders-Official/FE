import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PhotoLabItem,
  PhotoLabListParams,
  PhotoLabFavoriteStatus,
  PagedApiResponse,
} from "@/types/photoLab";

// 현상소 목록 조회
export async function getPhotoLabList(
  params: PhotoLabListParams,
): Promise<PagedApiResponse<PhotoLabItem[]>> {
  const res = await axiosInstance.get<PagedApiResponse<PhotoLabItem[]>>(
    "/photo-labs",
    {
      params: {
        q: params.q,
        tagIds: params.tagIds,
        regionId: params.regionId,
        date: params.date,
        page: params.page,
        size: params.size,
        lat: params.lat,
        lng: params.lng,
      },
    },
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
