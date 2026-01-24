import type { PostImage } from "./postPreview";

export type PostResponse = {
  postId: number;
  user: User;
  createdAt: string;
  title: string;
  content: string;
  image: PostImage;
  likeCount: number;
  isLiked: boolean;
  isSelfDeveloped: boolean;
  isMine: boolean;
  commentCount: number;
  labReview: LabReview;
};

type LabReview = {
  labId: number;
  labName: string;
  content: string;
};

type User = {
  profileImageUrl: string;
  nickname: string;
};

export type PostRequest = {
  title: string;
  content: string;
  image: PostImage;
  isSelfDeveloped: boolean;
  labId?: number;
  reviewContent?: string;
};

export type Lab = {
  labId: number;
  name: string;
  address: string;
  distance: string;
};

export type LabSearchList = {
  labSearchList: Lab[];
};
