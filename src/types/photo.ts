import mock1 from "../assets/mocks/mock1.jpg";
import mock2 from "../assets/mocks/mock2.jpg";
import mock3 from "../assets/mocks/mock3.jpg";
import mock4 from "../assets/mocks/mock4.jpg";
import mock5 from "../assets/mocks/mock5.jpg";
import mock6 from "../assets/mocks/mock6.jpg";
import mock7 from "../assets/mocks/mock7.jpg";

export type Photo = {
  id: number;
  src: string;
  title: string;
};

// Mock 데이터
export const photoMock: Photo[] = [
  { id: 1, src: mock1, title: "크리스마스 산타케이크입니당" },
  { id: 2, src: mock2, title: "이건 산타 책.." },
  { id: 3, src: mock3, title: "요건 귀여운 눈사람만들기" },
  { id: 4, src: mock4, title: "얜 맛있겠죠?" },
  { id: 5, src: mock5, title: "아기 눈사람이에오" },
  { id: 6, src: mock6, title: "목도리 탐난다" },
  { id: 7, src: mock7, title: "멜크멜크" },
];
