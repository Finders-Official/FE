import type { PostImage } from "./postPreview";

export type PostResponse = {
  postId: number;
  user: User;
  createdAt: string;
  title: string;
  content: string;
  image: PostImage[];
  likeCount: number;
  isLiked: boolean;
  isSelfDeveloped: boolean;
  isMine: boolean;
  commentCount: number;
  labReview?: LabReview;
};

type LabReview = {
  labId: number;
  labName: string;
  content: string;
};

type User = {
  userId: number;
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

const mockPostImage1: PostImage = {
  imageUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
  width: 1200,
  height: 800,
};

const mockPostImage2: PostImage = {
  imageUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
  width: 1200,
  height: 800,
};

const mockPostImage3: PostImage = {
  imageUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
  width: 1200,
  height: 800,
};

export const mockSelfPostResponse: PostResponse = {
  postId: 42,
  user: {
    userId: 1,
    nickname: "rin42",
    profileImageUrl: "https://i.pravatar.cc/100?img=5",
  },
  createdAt: "2026-01-22T13:45:00",
  title: "겨울 오후의 빛",
  content:
    "햇빛이 유리창에 반사되는 순간이 너무 예뻐서 셔터를 눌렀어요. 필름 특유의 부드러운 색감이 마음에 듭니다.",
  image: [mockPostImage1, mockPostImage2, mockPostImage3],
  likeCount: 27,
  isLiked: true,
  isSelfDeveloped: true,
  isMine: true,
  commentCount: 6,
};

export const mockLabPostResponse: PostResponse = {
  postId: 42,
  user: {
    userId: 1,
    nickname: "rin42",
    profileImageUrl: "https://i.pravatar.cc/100?img=5",
  },
  createdAt: "2026-01-22T13:45:00",
  title: "겨울 오후의 빛",
  content:
    "햇빛이 유리창에 반사되는 순간이 너무 예뻐서 셔터를 눌렀어요. 필름 특유의 부드러운 색감이 마음에 듭니다.",
  image: [mockPostImage1, mockPostImage2, mockPostImage3],
  likeCount: 27,
  isLiked: true,
  isSelfDeveloped: false,
  isMine: true,
  commentCount: 6,
  labReview: {
    labId: 3,
    labName: "포토랩 민트",
    content: "스캔 색감이 자연스럽고 입자 표현이 정말 좋아요.",
  },
};
