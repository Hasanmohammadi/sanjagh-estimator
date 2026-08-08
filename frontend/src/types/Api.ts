export interface ApiError {
  en: string;
  fa: string;
}

export interface ApiResponse<T> {
  data: T | null;
  status: "success" | "error";
  error: ApiError | null;
}
