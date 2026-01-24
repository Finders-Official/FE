import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { PostRequest } from "@/types/photoFeed/post";

/**
 * 게시물 작성
 */
export async function createPost(payload: PostRequest) {
  const res = await axiosInstance.post<ApiResponse<number>>(
    "/api/posts",
    payload,
  );

  return res.data;
}

/**
 * 현상소 검색
 */

/**
 * 게시글 상세 조회
 */

/**
 * 게시글 삭제
 */

/**
 * 게시글 좋아요
 */

/**
 * 현상소 좋아요 취소
 */

/**
 * 현상소 댓글 조회
 */

/**
 * 현상소 댓글 작성
 */

/**
 * 현상소 댓글 삭제
 */
