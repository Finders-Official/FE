export interface CameraInfo {
  cameraId: string;
  company: string;
  model: string;
  name: string;
}

export interface FilmInfo {
  filmId: string;
  company: string;
  model: string;
  name: string;
}

export interface EquipmentItem {
  combinationId: string;
  nickname: string;
  isDefault: boolean;
  camera: CameraInfo;
  film: FilmInfo;
  createdAt: string;
}

export interface EquipmentListResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    items: EquipmentItem[];
    nextCursor: string | null;
    hasNext: boolean;
  };
}

export interface CatalogItem {
  cameraId?: string;
  filmId?: string;
  company: string;
  model: string;
  name: string;
}

export interface CatalogResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    items: CatalogItem[];
    nextCursor: string | null;
    hasNext: boolean;
  };
}
