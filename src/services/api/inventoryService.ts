import apiClient from './apiClient';
import { InventoryTransaction } from '@types/api';

const base = '/api/inventory-transaction';

export async function getAllTransactions(): Promise<InventoryTransaction[]> {
  const res = await apiClient.get<InventoryTransaction[]>(base);
  return (res.data?.data ?? res.data ?? []) as InventoryTransaction[];
}

export async function getTransactionById(id: number): Promise<InventoryTransaction> {
  const res = await apiClient.get<InventoryTransaction>(`${base}/${id}`);
  return (res.data?.data ?? res.data) as InventoryTransaction;
}

export async function createTransaction(payload: {
  ingredient: { id: number };
  quantity: number;
  transactionType: boolean;
}): Promise<InventoryTransaction> {
  const res = await apiClient.post<InventoryTransaction>(base, payload);
  return (res.data?.data ?? res.data) as InventoryTransaction;
}

export async function updateTransaction(id: number, payload: InventoryTransaction): Promise<InventoryTransaction> {
  const res = await apiClient.put<InventoryTransaction>(`${base}/${id}`, payload);
  return (res.data?.data ?? res.data) as InventoryTransaction;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`${base}/${id}`);
}


