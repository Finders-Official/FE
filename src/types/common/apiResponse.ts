export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

export interface Slice {
  page: number;
  size: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type ApiResponseWithSlice<T> = ApiResponse<T> & {
  slice: Slice;
};
