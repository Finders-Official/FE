import { axiosInstance } from "@/lib/axiosInstance";
import { isAxiosError } from "axios";

export interface Lab {
  photoLabId: number;
  name: string;
  mainImageUrl: string;
  workCount: number;
  tags: string[];
}

export interface CommunityPost {
  postId: number;
  image: {
    imageUrl: string;
    width: number;
    height: number;
  };
  title: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

interface PopularLabsApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: Lab[];
}

interface CommunityPostsApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    previewList: CommunityPost[];
    totalCount: number;
    isLast: boolean;
  };
}

/** 인기 현상소 목록 */
export const fetchPopularLabs = async (): Promise<Lab[]> => {
  const response = await axiosInstance.get<PopularLabsApiResponse>(
    "/photo-labs/popular",
  );
  const { data: json } = response;

  if (!json.success) {
    throw new Error(`API Error: ${json.message}`);
  }

  return json.data;
};

/** 커뮤니티 게시글 미리보기 목록 */
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
  const response =
    await axiosInstance.get<CommunityPostsApiResponse>("/posts/preview");
  const { data: json } = response;

  if (!json.success || !json.data || !Array.isArray(json.data.previewList)) {
    throw new Error(`API Error or malformed data: ${json.message}`);
  }

  return json.data.previewList;
};

/** 게시글 좋아요 */
export const likePost = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/posts/${postId}/likes`);
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.code === "MEMBER_404") {
      throw new Error("회원 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    }
    throw error;
  }
};

/** 게시글 좋아요 취소 */
export const unlikePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete(`/posts/${postId}/likes`);
};
