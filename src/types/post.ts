import mock1 from "../assets/mocks/mock3.jpg";
import mock2 from "../assets/mocks/mock5.jpg";
import mock3 from "../assets/mocks/mock6.jpg";
import mock4 from "../assets/mocks/mock8.jpg";

export type Post = {
  id: number;
  isSelfProcessed: boolean;
  date: string;
  likes: number;
  comments: number;
  photoUrl: string[];
  title: string;
  content: string;
  lab: Lab;
  user?: User;
};

type Lab = {
  name: string;
  review: string;
};

type User = {
  id: number;
  username: string;
  avatarUrl: string;
};

// 자가현상 Mock 데이터
export const postSelfMock: Post = {
  id: 1,
  isSelfProcessed: true,
  date: "2026년 1월 10일",
  likes: 120,
  comments: 45,
  photoUrl: [mock1, mock2, mock3],
  title: "제가 만든 눈사람 컬렉션임니당!!",
  content: "아주 귀여운 아가들이에용... 여러분도 한번 만들어보세용!",
  lab: {
    name: "파인더스 강남점",
    review: "사진이 정말 잘 나왔어요! 다음에도 이용할게요.",
  },
  user: {
    id: 1,
    username: "도담",
    avatarUrl: mock4,
  },
};

// Mock 데이터
export const postMock: Post = {
  id: 2,
  isSelfProcessed: false,
  date: "2026년 1월 10일",
  likes: 120,
  comments: 45,
  photoUrl: [mock1, mock2, mock3],
  title: "제가 만든 눈사람 컬렉션임니당!!",
  content: "아주 귀여운 아가들이에용... 여러분도 한번 만들어보세용!",
  lab: {
    name: "파인더스 강남점",
    review: "사진이 정말 잘 나왔어요! 다음에도 이용할게요.",
  },
  user: {
    id: 1,
    username: "도담",
    avatarUrl: mock4,
  },
};
