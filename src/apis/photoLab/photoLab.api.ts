import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PhotoLabItem,
  PhotoLabListParams,
  PhotoLabFavoriteStatus,
  PhotoLabDetail,
  PagedApiResponse,
  RegionFilterData,
} from "@/types/photoLab";
import type { PopularLab, LabPreview } from "@/types/photoLabSearch";

// 배열 파라미터 직렬화
function serializeListParams(params: PhotoLabListParams) {
  return {
    ...params,
    tagIds: params.tagIds?.join(","),
    regionIds: params.regionIds?.join(","),
    time: params.time?.join(","),
  };
}

// 현상소 목록 조회
export async function getPhotoLabList(
  params: PhotoLabListParams,
): Promise<PagedApiResponse<PhotoLabItem[]>> {
  const res = await axiosInstance.get<PagedApiResponse<PhotoLabItem[]>>(
    "/photo-labs",
    { params: serializeListParams(params) },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 즐겨찾기 추가
export async function addFavorite(
  photoLabId: number,
): Promise<ApiResponse<PhotoLabFavoriteStatus>> {
  const res = await axiosInstance.post<ApiResponse<PhotoLabFavoriteStatus>>(
    `/photo-labs/${photoLabId}/favorites`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 즐겨찾기 삭제
export async function removeFavorite(
  photoLabId: number,
): Promise<ApiResponse<PhotoLabFavoriteStatus>> {
  const res = await axiosInstance.delete<ApiResponse<PhotoLabFavoriteStatus>>(
    `/photo-labs/${photoLabId}/favorites`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 인기 현상소 조회
export async function getPopularPhotoLabs(): Promise<
  ApiResponse<PopularLab[]>
> {
  const res = await axiosInstance.get<ApiResponse<PopularLab[]>>(
    "/photo-labs/popular",
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 지역별 현상소 개수 조회
export async function getRegionFilters(): Promise<
  ApiResponse<RegionFilterData>
> {
  const res = await axiosInstance.get<ApiResponse<RegionFilterData>>(
    "/photo-labs/regions",
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 검색어 자동완성
export async function getAutocomplete(
  keyword: string,
  signal?: AbortSignal,
): Promise<ApiResponse<string[]>> {
  const res = await axiosInstance.get<ApiResponse<string[]>>(
    "/photo-labs/search/autocomplete",
    { params: { keyword }, signal },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 검색 미리보기 (경량)
export async function getSearchPreview(
  params: PhotoLabListParams,
  signal?: AbortSignal,
): Promise<PagedApiResponse<LabPreview[]>> {
  const res = await axiosInstance.get<PagedApiResponse<LabPreview[]>>(
    "/photo-labs/search/preview",
    { params: serializeListParams(params), signal },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 현상소 상세 조회
export async function getPhotoLabDetail(
  photoLabId: number,
  params?: { lat?: number; lng?: number },
): Promise<ApiResponse<PhotoLabDetail>> {
  const res = await axiosInstance.get<ApiResponse<PhotoLabDetail>>(
    `/photo-labs/${photoLabId}`,
    { params },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
