import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PostComment,
  PostCommentList,
} from "@/types/photoFeed/postDetail";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";

/**
 * 게시글 댓글 조회
 */
export async function getComments(
  postId: number,
  pageParam: number = 0,
): Promise<PostCommentList> {
  const res = await axiosInstance.get<ApiResponse<PostCommentList>>(
    `/posts/${postId}/comments`,
    {
      params: {
        page: pageParam,
        size: PAGE_SIZE,
      },
    },
  );

  return res.data.data;
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

  return res.data.data; // 작성한 댓글 정보 return
}

/**
 * 게시글 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<boolean> {
  const res = await axiosInstance.delete<ApiResponse<void>>(
    `/posts/comments/${commentId}`,
  );

  return res.data.success; // 댓글 삭제 성공 여부 return
}
