import apiClient from './apiClient';
import { IngredientsGetByDishResponse } from './dishService';

export interface Recipe {
  id: number;
  ingredient: {
    id: number;
    name: string;
    unit?: string;
  };
  quantity: number;
  dish: {
    id: number;
    name: string;
  };
}

export const recipeService = {
  getAll: async (): Promise<Recipe[]> => {
    const res = await apiClient.get<Recipe[]>('/api/recipe');
    return (res.data?.data ?? res.data ?? []) as Recipe[];
  },

  getByDishId: async (dishId: number): Promise<IngredientsGetByDishResponse | null> => {
    try {
      const res = await apiClient.get<IngredientsGetByDishResponse>(`/api/recipe/by-dish/${dishId}`);
      return (res.data?.data ?? res.data) as IngredientsGetByDishResponse;
    } catch (error) {
      return null;
    }
  },
};

export default recipeService;
