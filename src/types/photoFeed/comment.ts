export type Comment = {
  commentId: number;
  user: User;
  content: string;
  createdAt?: string;
  isMine: boolean;
};

type User = {
  nickname: string;
  profileImageUrl: string;
};

export type CommentList = {
  commentList: Comment[];
  listSize: number;
  hasNext: boolean;
};
