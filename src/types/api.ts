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

export type PaymentMethod = "COD" | "VNPAY";
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

// Order API v3 types
export interface DishTemplate {
  size: 'S' | 'M' | 'L';
  name?: string;
  priceRatio?: number;
  quantityRatio?: number;
  max_Carb?: number;
  max_Protein?: number;
  max_Vegetable?: number;
}

export type RecipeSourceType = 'BASE' | 'ADDON' | 'REMOVED';

export interface RecipeItemDTO {
  ingredientId: number;
  quantity: number;
  sourceType: RecipeSourceType;
}

export interface OrderItemDTO {
  dishId: number;
  basedOnId?: number;
  name: string;
  quantity: number;
  note?: string;
  dishTemplate?: DishTemplate;
  recipe?: RecipeItemDTO[];
}

export interface MakeOrderRequest {
  accountId: number;
  paymentMethod: string;
  note?: string;
  totalPrice: number;
  items: OrderItemDTO[];
}

// Order response từ API v3
export type OrderStatusV3 = 'PENDING' | 'COMPLETED' | 'PAID' | 'CANCELLED';

export interface Orders {
  id: number;
  createAt: string;
  totalPrice: number;
  status: OrderStatusV3;
  userId: number;
  staffId?: number;
  note?: string;
  ranking?: number;
  comment?: string;
}

