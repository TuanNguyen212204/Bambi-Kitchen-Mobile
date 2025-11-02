import apiClient from './apiClient';

export interface DishCategory {
  id: number;
  name: string;
  description?: string;
}

export interface DishCategoryCreateRequest {
  name: string;
  description?: string;
}

export interface DishCategoryUpdateRequest {
  id: number;
  name: string;
  description?: string;
}

export const dishCategoryService = {
  getAll: async (): Promise<DishCategory[]> => {
    const res = await apiClient.get<DishCategory[]>('/api/dish-category');
    return (res.data?.data ?? res.data ?? []) as DishCategory[];
  },

  getById: async (id: number): Promise<DishCategory> => {
    const res = await apiClient.get<DishCategory>(`/api/dish-category/${id}`);
    return (res.data?.data ?? res.data) as DishCategory;
  },

  create: async (request: DishCategoryCreateRequest): Promise<DishCategory> => {
    const res = await apiClient.post<DishCategory>('/api/dish-category', request);
    return (res.data?.data ?? res.data) as DishCategory;
  },

  update: async (request: DishCategoryUpdateRequest): Promise<DishCategory> => {
    const res = await apiClient.put<DishCategory>('/api/dish-category', request);
    return (res.data?.data ?? res.data) as DishCategory;
  },

  delete: async (id: number): Promise<string> => {
    const res = await apiClient.delete<string>(`/api/dish-category/${id}`);
    return (res.data?.data ?? res.data ?? '');
  },
};

export default dishCategoryService;

