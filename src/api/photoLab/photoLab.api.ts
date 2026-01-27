import { axiosInstance } from "@/lib/axiosInstance";
import type {
  PhotoLabItem,
  PhotoLabListParams,
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
