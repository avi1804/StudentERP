export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
