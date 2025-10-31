import apiClient from './apiClient';
import { IngredientCategory } from '@types/api';

const base = '/api/ingredient-category';

export async function getAllCategories(): Promise<IngredientCategory[]> {
  const { data } = await apiClient.get<IngredientCategory[]>(base);
  return data;
}

export async function getCategoryById(id: number): Promise<IngredientCategory> {
  const { data } = await apiClient.get<IngredientCategory>(`${base}/${id}`);
  return data;
}

export async function createCategory(payload: { name: string; description?: string }): Promise<IngredientCategory> {
  const { data } = await apiClient.post<IngredientCategory>(base, payload);
  return data;
}

export async function updateCategory(payload: { id: number; name: string; description?: string }): Promise<IngredientCategory> {
  const { data } = await apiClient.put<IngredientCategory>(base, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`${base}/${id}`);
}


