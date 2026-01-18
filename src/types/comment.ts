import mock1 from "../assets/mocks/mock5.jpg";
import mock2 from "../assets/mocks/mock6.jpg";
import mock3 from "../assets/mocks/mock7.jpg";
import mock4 from "../assets/mocks/mock8.jpg";

export type Comment = {
  id: number;
  user?: User;
  createdAt?: string;
  content: string;
};

type User = {
  id: number;
  username: string;
  avatarUrl: string;
};

// 사용자 mock 데이터
const userMock: User[] = [
  { id: 1, username: "도담", avatarUrl: mock4 },
  { id: 2, username: "나무", avatarUrl: mock3 },
  { id: 3, username: "민티", avatarUrl: mock2 },
  { id: 4, username: "현서", avatarUrl: mock1 },
];

// 댓글 mock 데이터
export const commentMock: Comment[] = [
  {
    id: 1,
    user: userMock[0],
    createdAt: "2026-01-09T12:34:56Z",
    content: "하잉",
  },
  {
    id: 2,
    user: userMock[1],
    createdAt: "2026-01-01T12:34:56Z",
    content: "헬로",
  },
  {
    id: 3,
    user: userMock[2],
    createdAt: "2026-01-03T12:34:56Z",
    content: "바잉",
  },
  {
    id: 4,
    user: userMock[3],
    createdAt: "2026-01-06T12:34:56Z",
    content: "굳",
  },
  {
    id: 5,
    user: userMock[0],
    createdAt: "2026-01-09T12:34:56Z",
    content: "하잉",
  },
  {
    id: 6,
    user: userMock[1],
    createdAt: "2026-01-01T12:34:56Z",
    content: "헬로",
  },
  {
    id: 7,
    user: userMock[2],
    createdAt: "2026-01-03T12:34:56Z",
    content: "바잉",
  },
  {
    id: 8,
    user: userMock[3],
    createdAt: "2026-01-06T12:34:56Z",
    content: "굳",
  },
  {
    id: 9,
    user: userMock[0],
    createdAt: "2026-01-09T12:34:56Z",
    content: "하잉",
  },
  {
    id: 10,
    user: userMock[1],
    createdAt: "2026-01-01T12:34:56Z",
    content: "헬로",
  },
  {
    id: 11,
    user: userMock[2],
    createdAt: "2026-01-03T12:34:56Z",
    content: "바잉",
  },
  {
    id: 12,
    user: userMock[3],
    createdAt: "2026-01-06T12:34:56Z",
    content: "굳",
  },
  {
    id: 13,
    user: userMock[2],
    createdAt: "2026-01-03T12:34:56Z",
    content: "바잉",
  },
  {
    id: 14,
    user: userMock[3],
    createdAt: "2026-01-06T12:34:56Z",
    content: "굳",
  },
  {
    id: 15,
    user: userMock[0],
    createdAt: "2026-01-09T12:34:56Z",
    content: "하잉",
  },
  {
    id: 16,
    user: userMock[1],
    createdAt: "2026-01-01T12:34:56Z",
    content: "헬로",
  },
  {
    id: 17,
    user: userMock[2],
    createdAt: "2026-01-03T12:34:56Z",
    content: "바잉",
  },
  {
    id: 18,
    user: userMock[3],
    createdAt: "2026-01-06T12:34:56Z",
    content: "굳",
  },
];
