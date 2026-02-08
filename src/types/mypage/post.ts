import type { ApiResponse } from "@/types/common/apiResponse";
import type { PhotoFeedResponse } from "../photoFeed/postPreview";

export type Post = {
  id: number;
  src: string;
  title: string;
  date: string; // 서버에 없으면 페이지에서 "" 넣는 현재 방식 OK
  likes: number;
};

export type GetPostPreviewPageResponse = ApiResponse<PhotoFeedResponse>;
