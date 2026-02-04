import type { ApiResponse } from "@/types/common/apiResponse";

export type Post = {
  id: number;
  src: string;
  title: string;
  date: string; // 서버에 없으면 페이지에서 "" 넣는 현재 방식 OK
  likes: number;
};

export interface PostPreviewImageDto {
  objectPath: string;
  width: number;
  height: number;
}

export interface PostPreviewDto {
  postId: number;
  image: PostPreviewImageDto;
  title: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface PostPreviewPageDto {
  previewList: PostPreviewDto[];
  totalCount: number;
  isLast: boolean;
}

export type GetPostPreviewPageResponse = ApiResponse<PostPreviewPageDto>;
