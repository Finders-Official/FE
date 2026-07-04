import type { ApiResponse } from "@/types/common/apiResponse";
import type { PhotoFeedResponse } from "../photoFeed/postPreview";

export type Post = {
  id: string;
  src: string;
  title: string;
  date: string;
  likes: number;
};

export type GetPostPreviewPageResponse = ApiResponse<PhotoFeedResponse>;
