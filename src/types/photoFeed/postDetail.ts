import type { PostImage } from "./postPreview";

/**
 * 게시글 상세보기 응답 (CO-030)
 */
export type PostDetailResponse = {
  postId: number;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  title: string;
  content: string;
  images: PostImage[];
  likeCount: number;
  isLiked: boolean;
  isSelfDeveloped: boolean;
  isMine: boolean;
  commentCount: number;
  labReview?: LabReview;
};

type LabReview = {
  postId: number;
  labId: number;
  labName: string;
  content: string;
};

export type PostRequestImage = {
  objectPath: string;
  width: number;
  height: number;
};

/**
 * 게시글 작성 요청 (CO-022)
 */
export type PostUploadRequest = {
  title: string;
  content: string;
  images: PostRequestImage[];
  isSelfDeveloped: boolean;
  labId?: number;
  reviewContent?: string;
};

/**
 * 게시글 좋아요
 */
export type LikesResponse = {
  likeCount: number;
  isLiked: boolean;
};

/**
 * 댓글 조회 응답 (CO-030)
 */
export type PostComment = {
  commentId: number;
  postId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

export type PostCommentList = {
  commentList: PostComment[];
  listSize: number;
  hasNext: boolean;
};
