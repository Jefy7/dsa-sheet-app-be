export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: unknown;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
