import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { LikesResponse } from "@/types/photoFeed/postDetail";

/**
 * 게시글 좋아요
 */
export async function postLike(postId: number): Promise<LikesResponse> {
  const res = await axiosInstance.post<ApiResponse<LikesResponse>>(
    `/posts/${postId}/likes`,
    null,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 게시글 좋아요 정보 return
}

/**
 * 게시글 좋아요 취소
 */
export async function deleteLike(postId: number): Promise<LikesResponse> {
  const res = await axiosInstance.delete<ApiResponse<LikesResponse>>(
    `/posts/${postId}/likes`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 게시글 좋아요 정보 return
}
