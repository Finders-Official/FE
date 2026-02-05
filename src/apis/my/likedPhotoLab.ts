import { axiosInstance } from "@/lib/axiosInstance";
import type { PageParams } from "@/types/mypage/params";
import type { GetFavoritePhotoLabsResponse } from "@/types/mypage/photolab";

export async function favoritePhotoLab(
  params: PageParams,
): Promise<GetFavoritePhotoLabsResponse> {
  const res = await axiosInstance.get<GetFavoritePhotoLabsResponse>(
    "/photo-labs/favorites",
    { params },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
