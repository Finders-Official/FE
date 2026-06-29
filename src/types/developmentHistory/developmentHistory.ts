export interface DevelopmentOrder {
  developmentOrderId: number;
  photoLabId: string;
  photoLabName: string;
  photoLabAddress: string;
  taskTypes: ("DEVELOP" | "SCAN" | "PRINT")[];
  rollCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  previewImageUrls: string[];
  deliveryAddress: string;
  deliveryAddressDetail: string;
  deliveredAt: string | null;
}

export interface SliceInfo {
  page: number;
  size: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface DevelopmentOrdersResponse {
  success: boolean;
  data: DevelopmentOrder[];
  slice: SliceInfo;
}
