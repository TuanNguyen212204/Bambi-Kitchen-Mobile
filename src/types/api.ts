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
  category?: IngredientCategory;
  unit: IngredientUnit;
  active?: boolean;
  imgUrl?: string;
  publicId?: string;
  quantity?: number;
  reserve?: number;
  lastReserveAt?: string;
  available?: number;
  pricePerUnit?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  category?: IngredientCategory;
  unit: IngredientUnit;
  active?: boolean;
  imgUrl?: string;
  publicId?: string;
  quantity?: number;
  reserve?: number;
  lastReserveAt?: string;
  available?: number;
  pricePerUnit?: number;
}


export interface InventoryTransaction {
  id: number;
  ingredient?: IngredientDTO;
  orders?: Orders;
  createAt?: string;
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
  dishId?: number; // Optional vì custom dish không có dishId
  basedOnId?: number;
  name: string;
  quantity: number;
  note?: string;
  dishTemplate?: DishTemplate; // CHỈ gửi khi có size hợp lệ
  recipe?: RecipeItemDTO[]; // Luôn gửi (có thể empty array)
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

export interface OrderItem {
  id: number;
  dishId?: number; // Optional vì custom dish có thể không có dishId
  dishName: string;
  quantity: number;
  note?: string;
  basedOnId?: number; // ID của dish gốc (cho preset dish đã chỉnh sửa)
  dishTemplate?: DishTemplate; // Size cho custom dish
  recipe?: RecipeItemDTO[]; // Recipe modifications (ADDON, REMOVED)
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
  totalPrice?: number;
  totalCalories?: number;
  items: OrderItem[];
}

// Account types từ API v3
export interface Account {
  id: number;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  createAt?: string;
  updateAt?: string;
  password?: string;
  mail: string;
  phone?: string;
  active?: boolean;
}

export interface AccountUpdateRequest {
  id: number;
  name: string;
  role?: 'ADMIN' | 'STAFF' | 'USER';
  mail?: string;
  phone?: string;
  password?: string;
  active?: boolean;
}

export interface OrderUpdateDto {
  orderId: number;
  comment?: string;
  ranking?: number;
}

export interface FeedbackDto {
  orderId: number;
  ranking: number;
  comment?: string;
  accountName?: string;
  accountId?: number;
}
