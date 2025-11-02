import apiClient from './apiClient';

export interface DishTemplate {
  size: 'S' | 'M' | 'L';
  name?: string;
  priceRatio?: number;
  quantityRatio?: number;
  max_Carb?: number;
  max_Protein?: number;
  max_Vegetable?: number;
}

export const dishTemplateService = {
  getAll: async (): Promise<DishTemplate[]> => {
    const res = await apiClient.get<DishTemplate[]>('/api/dish-template');
    return (res.data?.data ?? res.data ?? []) as DishTemplate[];
  },

  getBySizeCode: async (sizeCode: 'S' | 'M' | 'L'): Promise<DishTemplate> => {
    const res = await apiClient.get<DishTemplate>(`/api/dish-template/${sizeCode}`);
    return (res.data?.data ?? res.data) as DishTemplate;
  },

  create: async (template: DishTemplate): Promise<DishTemplate> => {
    const res = await apiClient.post<DishTemplate>('/api/dish-template', template);
    return (res.data?.data ?? res.data) as DishTemplate;
  },

  delete: async (sizeCode: 'S' | 'M' | 'L'): Promise<void> => {
    await apiClient.delete(`/api/dish-template/${sizeCode}`);
  },
};

export default dishTemplateService;

