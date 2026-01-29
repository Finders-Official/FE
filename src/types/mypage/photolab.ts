import type { ApiResponse } from "@/types/common/apiResponse";

export interface FavoritePhotoLabDto {
  photoLabId: number;
  name: string;
  imageUrls: string[];
  tags: string[];
  address: string;
  distance: string;
  isFavorite: boolean;
  totalWorkCount: number;
  avgWorkTime: number;
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
  tags: string[];
  address: string;
  distanceText: string; // "1.5km"
  isFavorite: boolean;
  totalWorkCount: number;
  estimatedMinutes: number; // avgWorkTime
};
