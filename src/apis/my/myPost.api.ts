import { axiosInstance } from "@/lib/axiosInstance";
import type { PageParams } from "@/types/mypage/params";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";

export async function getMyPosts(
  params: PageParams,
): Promise<GetPostPreviewPageResponse> {
  const res = await axiosInstance.get<GetPostPreviewPageResponse>("/posts/me", {
    params,
  });
  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
