import type { ApiResponse } from "@/types/common/apiResponse";

export type Post = {
  id: number;
  src: string;
  title: string;
  date: string;
  likes: number;
};

export interface PostPreviewImageDto {
  imageUrl: string;
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
  //date: string;
}

export interface PostPreviewPageDto {
  previewList: PostPreviewDto[];
  totalCount: number;
  isLast: boolean;
}

export type GetPostPreviewPageResponse = ApiResponse<PostPreviewPageDto>;
