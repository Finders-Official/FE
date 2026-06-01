import type { ApiResponse } from "@/types/common/apiResponse";

export interface FavoritePhotoLabDto {
  photoLabId: number;
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: string;
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
  id: number; // photoLabId
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: string; // "1.5km"
  isFavorite: boolean;
  favoriteCount: number; // 총 좋아요 개수 추가 필요
};
