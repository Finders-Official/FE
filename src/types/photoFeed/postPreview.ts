export const PAGE_SIZE = 20;

/**
 * 사진수다 메인 피드 조회 응답 (CO-010, CO-013)
 */
export type PostPreview = {
  postId: string;
  image: PostImage;
  title: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
};

export type PostImage = {
  imageUrl: string;
  width: number;
  height: number;
};

export type PhotoFeedResponse = {
  previewList: PostPreview[];
  totalCount: number;
  isLast: boolean;
};
