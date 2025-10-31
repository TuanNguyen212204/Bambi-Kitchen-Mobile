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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export type OrderStatus = 'NEW' | 'ASSIGNED' | 'PREPARING' | 'DONE' | 'CANCELLED';

export interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  note?: string;
}

export interface Order {
  id: number;
  code?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: 'COD' | 'ONLINE' | string;
  isPaid?: boolean;
  status: OrderStatus;
  createdAt?: string;
  items: OrderItem[];
}

