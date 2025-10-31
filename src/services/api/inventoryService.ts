import apiClient from './apiClient';
import { InventoryTransaction } from '@types/api';

const base = '/api/inventory-transaction';

export async function getAllTransactions(): Promise<InventoryTransaction[]> {
  const { data } = await apiClient.get<InventoryTransaction[]>(base);
  return data;
}

export async function createTransaction(payload: {
  ingredient: { id: number };
  quantity: number;
  transactionType: boolean;
}): Promise<InventoryTransaction> {
  const { data } = await apiClient.post<InventoryTransaction>(base, payload);
  return data;
}


