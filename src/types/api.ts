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

// Ingredient management
export type IngredientUnit = 'GRAM' | 'KILOGRAM' | 'LITER' | 'PCS';

export interface IngredientCategory {
  id: number;
  name: string;
  description?: string;
  priority?: number;
}

export interface IngredientDTO {
  id: number;
  name: string;
  category?: { id: number; name: string } | string | null;
  unit: IngredientUnit | string;
  active?: boolean;
  imgUrl?: string | null;
  quantity?: number | string | null;
  available?: number | string | null;
  reserve?: number | string | null;
  pricePerUnit?: number | string | null;
}

export interface Ingredient extends Omit<IngredientDTO, 'quantity' | 'available' | 'reserve' | 'unit' | 'category' | 'pricePerUnit'> {
  unit: IngredientUnit;
  category?: { id: number; name: string } | null;
  quantity?: number | null;
  available?: number | null;
  reserve?: number | null;
  pricePerUnit?: number | null;
  stock: number;
  stockStatus: 'out' | 'low' | 'normal';
}

export interface InventoryTransaction {
  id: number;
  ingredient: { id: number } | Ingredient;
  quantity: number;
  transactionType: boolean; // true: in, false: out
  createdAt?: string;
}

