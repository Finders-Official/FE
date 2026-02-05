import type { PostImage } from "./postPreview";

/**
 * 게시글 상세보기 응답 (CO-030)
 */
export type PostDetailResponse = {
  postId: number;
  user: User;
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
  labId: number;
  labName: string;
  content: string;
};

export type User = {
  userId?: number;
  nickname: string;
  profileImageUrl: string;
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
  user: User;
  content: string;
  createdAt?: string;
  isMine: boolean;
};

export type PostCommentList = {
  commentList: PostComment[];
  listSize: number;
  hasNext: boolean;
};

/**
 * mock 데이터
 */
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

export const mockSelfPostResponse: PostDetailResponse = {
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
  images: [mockPostImage1, mockPostImage2, mockPostImage3],
  likeCount: 27,
  isLiked: true,
  isSelfDeveloped: true,
  isMine: true,
  commentCount: 6,
};

export const mockLabPostResponse: PostDetailResponse = {
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
  images: [mockPostImage1, mockPostImage2, mockPostImage3],
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

export const commentMock: PostComment[] = [
  {
    commentId: 1,
    user: {
      userId: 1,
      nickname: "혜린",
      profileImageUrl: "https://i.pravatar.cc/100?img=12",
    },
    content: "와… 색감 진짜 너무 예쁘다 🥹 필름 감성 최고!",
    createdAt: "2026-01-20T14:32:00",
    isMine: false,
  },
  {
    commentId: 2,
    user: {
      userId: 2,
      nickname: "rin42",
      profileImageUrl: "https://i.pravatar.cc/100?img=5",
    },
    content: "헉 고마워요! 현상도 잘 된 것 같아서 만족 중이에요 😊",
    createdAt: "2026-01-20T14:35:12",
    isMine: true,
  },
  {
    commentId: 3,
    user: {
      userId: 3,
      nickname: "film_daily",
      profileImageUrl: "https://i.pravatar.cc/100?img=20",
    },
    content: "이 필름 뭐 쓰셨어요? 입자감이 딱 제 취향이에요.",
    createdAt: "2026-01-20T14:40:45",
    isMine: false,
  },
  {
    commentId: 4,
    user: {
      userId: 4,
      nickname: "rin42",
      profileImageUrl: "https://i.pravatar.cc/100?img=5",
    },
    content: "Kodak Gold 200 써봤어요! 낮에 찍기 좋더라구요 🌞",
    isMine: true, // createdAt 생략 케이스
  },
];
