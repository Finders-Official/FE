import { axiosInstance } from "@/lib/axiosInstance";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";

export type GetMyPostsParams = {
  page: number;
  size: number;
};

export async function getMyPosts(params: GetMyPostsParams) {
  const res = await axiosInstance.get<GetPostPreviewPageResponse>("/posts/me", {
    params,
  });
  return res.data;
}
