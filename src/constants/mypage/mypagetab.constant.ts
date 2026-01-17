import { LikedPhotoLabIcon, LikedPostIcon, MyPostIcon } from "@/assets/icon";
import type { TabItem } from "@/types/mypage/mypagetab";

export const tabs: TabItem[] = [
  { to: "./liked-photolabs", label: "관심 현상소", Icon: LikedPhotoLabIcon },
  { to: "./liked-posts", label: "관심 게시글", Icon: LikedPostIcon },
  { to: "./my-posts", label: "내가 쓴 글", Icon: MyPostIcon },
];
