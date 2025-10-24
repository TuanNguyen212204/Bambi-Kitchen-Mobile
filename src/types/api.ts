// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Thêm các types khác cho API của bạn
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

