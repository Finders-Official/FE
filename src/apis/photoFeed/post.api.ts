import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PostUploadRequest,
  PostDetailResponse,
} from "@/types/photoFeed/postDetail";
import {
  PAGE_SIZE,
  type PhotoFeedResponse,
} from "@/types/photoFeed/postPreview";

/**
 * 사진수다 메인 피드 게시글 조회
 */
export async function getPosts({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<PhotoFeedResponse> {
  const res = await axiosInstance.get<ApiResponse<PhotoFeedResponse>>(
    "/posts",
    {
      params: {
        page: pageParam,
        size: PAGE_SIZE,
      },
    },
  );

  return res.data.data; // 게시글 프리뷰 리스트 return
}

/**
 * 게시물 작성
 */
export async function createPost(payload: PostUploadRequest): Promise<number> {
  const res = await axiosInstance.post<ApiResponse<number>>("/posts", payload);

  return res.data.data; // postId return
}

/**
 * 게시글 상세 조회
 */
export async function getPostDetail(
  postId: number,
): Promise<PostDetailResponse> {
  const res = await axiosInstance.get<ApiResponse<PostDetailResponse>>(
    `/posts/${postId}`,
  );

  return res.data.data; // 게시글 상세 정보 return
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: number): Promise<boolean> {
  const res = await axiosInstance.delete<ApiResponse<void>>(`/posts/${postId}`);

  return res.data.success; // 게시글 삭제 성공 여부 return
}
