const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

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
  const response = await fetch(`${BASE_URL}/photo-labs/popular`);

  if (!response.ok) {
    throw new Error(`HTTP 에러! status: ${response.status}`);
  }

  const json: PopularLabsApiResponse = await response.json();

  if (!json.success) {
    throw new Error(`API Error: ${json.message}`);
  }

  return json.data;
};

/** 커뮤니티 게시글 미리보기 목록 */
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/posts/preview`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: CommunityPostsApiResponse = await response.json();

  if (!json.success || !json.data || !Array.isArray(json.data.previewList)) {
    throw new Error(`API Error or malformed data: ${json.message}`);
  }

  return json.data.previewList;
};

/** 게시글에 좋아요 */
export const likePost = async (postId: number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("로그인이 필요한 서비스입니다.");
  }

  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.code === "MEMBER_404") {
      localStorage.removeItem("accessToken");
      throw new Error("회원 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    }
    throw new Error(`Like failed with status: ${response.status}`);
  }
};

/** 게시글 좋아요 취소 */
export const unlikePost = async (postId: number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("로그인이 필요한 서비스입니다.");
  }

  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unlike failed with status: ${response.status}`);
  }
};
