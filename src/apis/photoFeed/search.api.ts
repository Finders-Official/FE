import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import {
  PAGE_SIZE,
  type PhotoFeedResponse,
} from "@/types/photoFeed/postPreview";
import type {
  SearchRequest,
  SearchHistory,
} from "@/types/photoFeed/postSearch";
import type {
  LabSearchRequest,
  LabSearchResponse,
  LabSearchResponseList,
} from "@/types/photoFeed/labSearch";

/**
 * 사진수다 게시글 검색
 */
export async function getPostSearches({
  keyword,
  filter,
  page,
  size = PAGE_SIZE,
  sort,
}: SearchRequest): Promise<PhotoFeedResponse> {
  const res = await axiosInstance.get<ApiResponse<PhotoFeedResponse>>(
    "/posts/search",
    {
      params: { keyword, filter, page, size, sort },
    },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 키워드에 맞는 게시글 프리뷰 리스트 return
}

/**
 * 사진수다 최근 검색어 조회
 */
export async function getRecentSearches(): Promise<SearchHistory[]> {
  const res = await axiosInstance.get<ApiResponse<SearchHistory[]>>(
    `/posts/search/history`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 최근 검색어 리스트 return
}

/**
 * 사진수다 최근 검색어 개별 삭제
 */
export async function deleteRecentSearch(historyId: number) {
  const res = await axiosInstance.delete<ApiResponse<void>>(
    `/posts/search/history/${historyId}`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return true; // 성공 여부 return
}

/**
 * 사진수다 최근 검색어 전체 삭제
 */
export async function deleteAllRecentSearch() {
  const res = await axiosInstance.delete<ApiResponse<void>>(
    `/posts/search/history/all`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return true; // 성공 여부 return
}

/**
 * 사진수다 연관 검색어
 */
export async function getRelatedSearches(keyword: string): Promise<string[]> {
  const res = await axiosInstance.get<ApiResponse<string[]>>(
    `/posts/search/autocomplete`,
    { params: { keyword } },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data; // 연관검색어 문자열 리스트 return
}

/**
 * 현상소 검색
 */
export async function getLabSearches({
  keyword,
  latitude,
  longitude,
  locationAgreed,
}: LabSearchRequest): Promise<LabSearchResponse[]> {
  const res = await axiosInstance.get<ApiResponse<LabSearchResponseList>>(
    "/photo-labs/search",
    {
      params: {
        keyword,
        latitude,
        longitude,
        locationAgreed,
      },
    },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data.photoLabSearchList ?? []; // 검색 결과 리스트 return
}
