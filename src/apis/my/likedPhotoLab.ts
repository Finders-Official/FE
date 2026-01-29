import { axiosInstance } from "@/lib/axiosInstance";
import type { PageParams } from "@/types/mypage/params";

export async function favoritePhotoLab(params: PageParams) {
  const res = await axiosInstance.get("/photo-labs/favorites", {
    params,
  });

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
