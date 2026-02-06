export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// pagenation용 ApiResponse
export type ApiResponseWithPagination<T> = ApiResponse<T> & {
  pagination: Pagination;
};
