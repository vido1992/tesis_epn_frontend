export interface ApiResponse<T = any> {
    status: boolean;
    message: string;
    total: number;
    result: T;
  }