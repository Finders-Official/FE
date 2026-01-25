import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { PhotoFeedResponse } from "@/types/photoFeed/postPreview";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";

/**
 * 사진수다 메인 피드 게시글 조회 API
 */
export async function getPosts({ pageParam = 0 }: { pageParam?: number }) {
  const res = await axiosInstance.get<ApiResponse<PhotoFeedResponse>>(
    `/api/posts?page=${pageParam}&size=${PAGE_SIZE}`,
  );

  return res.data.data.previewList;
}

/**
 * 사진수다 게시글 검색
 */

/**
 * 사진수다 최근 검색어 조회
 */

/**
 * 사진수다 최근 검색어 개별 삭제
 */

/**
 * 사진수다 최근 검색어 전체 삭제
 */

/**
 * 사진수다 연관 검색어
 */
