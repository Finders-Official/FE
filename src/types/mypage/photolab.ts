import type { ApiResponse } from "@/types/common/apiResponse";

export interface FavoritePhotoLabDto {
  photoLabId: string;
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: number | null;
  isFavorite: boolean;
  favoriteCount: number;
}

export interface PageInfoDto {
  currentPage: number;
  pageSize: number;
  isLast: boolean;
}

export interface FavoritePhotoLabsDataDto {
  photoLabs: FavoritePhotoLabDto[];
  pageInfo: PageInfoDto;
}

export type GetFavoritePhotoLabsResponse =
  ApiResponse<FavoritePhotoLabsDataDto>;

export type PhotoLab = {
  id: string; // photoLabId
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: number | null; // 위치 동의 없으면 null
  isFavorite: boolean;
  favoriteCount: number; // 총 좋아요 개수
};
