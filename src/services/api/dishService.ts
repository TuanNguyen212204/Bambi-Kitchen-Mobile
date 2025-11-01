import apiClient from './apiClient';

export interface DishDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  publicId?: string;
  account?: { id: number; name: string; role?: string };
  dishType?: 'PRESET' | 'CUSTOM';
  usedQuantity?: number;
  public?: boolean;
  active?: boolean;
}

export interface DishCategory {
  id: number;
  name: string;
  description?: string;
}

export interface IngredientsGetByDishResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  publicId?: string;
  account?: { id: number; name: string; role?: string };
  ingredients: Array<{
    id: number;
    name: string;
    quantity?: number;
    unit?: string;
  }>;
  dishType: 'PRESET' | 'CUSTOM';
  public?: boolean;
  active?: boolean;
}

export const dishService = {
  getAll: async (): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>('/api/dish');
    return (res.data?.data ?? res.data ?? []) as DishDto[];
  },
  
  getById: async (id: number): Promise<DishDto | null> => {
    try {
      const res = await apiClient.get<DishDto>(`/api/dish/${id}`);
      return (res.data?.data ?? res.data) as DishDto;
    } catch (error) {
      return null;
    }
  },
  
  getCategories: async (): Promise<DishCategory[]> => {
    const res = await apiClient.get<DishCategory[]>('/api/dish-category');
    return (res.data?.data ?? res.data ?? []) as DishCategory[];
  },
};


