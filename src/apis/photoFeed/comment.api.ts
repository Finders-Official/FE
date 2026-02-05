import { axiosInstance } from "@/lib/axiosInstance";
import type {
  ApiResponse,
  ApiResponseWithPagination,
} from "@/types/common/apiResponse";
import type { PostComment } from "@/types/photoFeed/postDetail";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";

/**
 * 게시글 댓글 조회
 */
export async function getComments(
  postId: number,
  pageParam: number = 0,
): Promise<ApiResponseWithPagination<PostComment[]>> {
  const res = await axiosInstance.get<ApiResponseWithPagination<PostComment[]>>(
    `/posts/${postId}/comments`,
    {
      params: {
        page: pageParam,
        size: PAGE_SIZE,
      },
    },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

/**
 * 게시글 댓글 작성
 */
export async function postComment(
  postId: number,
  content: string,
): Promise<PostComment> {
  const res = await axiosInstance.post<ApiResponse<PostComment>>(
    `/posts/${postId}/comments`,
    { content },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 작성한 댓글 정보 return
}

/**
 * 게시글 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<boolean> {
  const res = await axiosInstance.delete<ApiResponse<void>>(
    `/posts/comments/${commentId}`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return true; // 댓글 삭제 성공 여부 return (success면 true)
}
