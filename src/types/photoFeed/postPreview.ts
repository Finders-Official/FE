export type PostPreview = {
  postId: number;
  image: PostImage;
  title: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
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

// Mock 데이터
export const photoMock: PostPreview[] = [
  {
    postId: 7,
    image: {
      imageUrl:
        "https://storage.googleapis.com/finders-public/temp/test-image-1.jpg",
      width: 1080,
      height: 1080,
    },
    title: "테스트 5",
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
  },
  {
    postId: 6,
    image: {
      imageUrl:
        "https://storage.googleapis.com/finders-public/temp/test-image-2.jpg",
      width: 1080,
      height: 1350,
    },
    title: "겨울 바다",
    likeCount: 12,
    commentCount: 3,
    isLiked: true,
  },
  {
    postId: 5,
    image: {
      imageUrl:
        "https://storage.googleapis.com/finders-public/temp/test-image-3.jpg",
      width: 1080,
      height: 720,
    },
    title: "필름 스캔 테스트",
    likeCount: 4,
    commentCount: 1,
    isLiked: false,
  },
];
