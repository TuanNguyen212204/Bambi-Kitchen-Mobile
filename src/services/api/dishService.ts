import apiClient from './apiClient';

export interface DishDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  publicId?: string;
}

export const dishService = {
  getAll: async (): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>('/api/dish');
    return res.data as any;
  },
};


