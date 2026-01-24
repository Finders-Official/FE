export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
};
