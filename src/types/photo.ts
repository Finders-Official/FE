import mock1 from "@/assets/mocks/mock1.jpg";
import mock2 from "@/assets/mocks/mock2.jpg";
import mock3 from "@/assets/mocks/mock3.jpg";
import mock4 from "@/assets/mocks/mock4.jpg";
import mock5 from "@/assets/mocks/mock5.jpg";

export type PhotoPreview = {
  postId: number;
  image: Image;
  title: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};

export type PreviewList = {
  previewList: PhotoPreview[];
  totalCount: number;
  isLast: boolean;
};

export type Image = {
  imageUrl: string;
  width: number;
  height: number;
};

/**
 * mock 데이터
 */
const mockImage1: Image = {
  imageUrl: mock1,
  width: 600,
  height: 800,
};

const mockImage2: Image = {
  imageUrl: mock2,
  width: 800,
  height: 600,
};

const mockImage3: Image = {
  imageUrl: mock3,
  width: 500,
  height: 750,
};

export const mockPhotoPreviews: PhotoPreview[] = [
  {
    postId: 1,
    image: mockImage1,
    title: "솔크기념 나홀로집에",
    likeCount: 24,
    commentCount: 5,
    isLiked: true,
  },
  {
    postId: 2,
    image: mockImage2,
    title: "책으로 만든 눈사람입니당",
    likeCount: 13,
    commentCount: 2,
    isLiked: false,
  },
  {
    postId: 3,
    image: mockImage3,
    title: "눈사람 뚱땅뚱땅 만들기",
    likeCount: 42,
    commentCount: 11,
    isLiked: true,
  },
  {
    postId: 4,
    image: {
      imageUrl: mock4,
      width: 700,
      height: 900,
    },
    title: "맛잇겟노.",
    likeCount: 8,
    commentCount: 1,
    isLiked: false,
  },
  {
    postId: 5,
    image: {
      imageUrl: mock5,
      width: 900,
      height: 600,
    },
    title: "오앙오앙오앙",
    likeCount: 67,
    commentCount: 18,
    isLiked: true,
  },
];

export const mockPreviewList: PreviewList = {
  previewList: mockPhotoPreviews,
  totalCount: 5,
  isLast: false,
};
