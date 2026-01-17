import type { Post } from "@/types/mypage/post";
import mock1 from "@/assets/mocks/mock1.jpg";
import mock2 from "@/assets/mocks/mock2.jpg";
import mock3 from "@/assets/mocks/mock3.jpg";
import mock4 from "@/assets/mocks/mock4.jpg";
import mock5 from "@/assets/mocks/mock5.jpg";
import mock6 from "@/assets/mocks/mock6.jpg";
import mock7 from "@/assets/mocks/mock7.jpg";

export const posts: Post[] = [
  {
    id: 1,
    src: mock1,
    title: "크리스마스 산타케이크입니당",
    date: "2025-12-24",
    likes: 12,
    isLiked: true,
  },
  {
    id: 2,
    src: mock2,
    title: "이건 산타 책..",
    date: "2025-12-23",
    likes: 7,
    isLiked: true,
  },
  {
    id: 3,
    src: mock3,
    title: "요건 귀여운 눈사람만들기",
    date: "2025-12-22",
    likes: 31,
    isLiked: true,
  },
  {
    id: 4,
    src: mock4,
    title: "얜 맛있겠죠?",
    date: "2025-12-21",
    likes: 18,
    isLiked: true,
  },
  {
    id: 5,
    src: mock5,
    title: "아기 눈사람이에오",
    date: "2025-12-20",
    likes: 5,
    isLiked: true,
  },
  {
    id: 6,
    src: mock6,
    title: "목도리 탐난다",
    date: "2025-12-19",
    likes: 44,
    isLiked: true,
  },
  {
    id: 7,
    src: mock7,
    title: "멜크멜크",
    date: "2025-12-18",
    likes: 9,
    isLiked: true,
  },
];

//삭제 예정
