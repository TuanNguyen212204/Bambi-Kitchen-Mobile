import apiClient from './apiClient';

export interface DishDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  publicId?: string;
  categoryId?: number;
}

export const dishService = {
  getAll: async (): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>('/api/dish');
    return res.data as any;
  },
  getCategories: async (): Promise<{ id: number; name: string }[]> => {
    const res = await apiClient.get<{ id: number; name: string }[]>('/api/dish-category');
    return res.data as any;
  },
};


