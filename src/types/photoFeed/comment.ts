export type Comment = {
  commentId: number;
  user: User;
  content: string;
  createdAt?: string;
  isMine: boolean;
};

type User = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
};

export type CommentList = {
  commentList: Comment[];
  listSize: number;
  hasNext: boolean;
};

export const commentMock: Comment[] = [
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
