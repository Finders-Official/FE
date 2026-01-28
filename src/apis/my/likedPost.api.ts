import { axiosInstance } from "@/lib/axiosInstance";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";

export type GetLikedPostsParams = {
  page: number;
  size: number;
};

export async function getLikedPosts(params: GetLikedPostsParams) {
  const res = await axiosInstance.get<GetPostPreviewPageResponse>(
    "/posts/likes",
    { params },
  );
  return res.data;
}
