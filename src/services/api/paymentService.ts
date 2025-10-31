import apiClient from "./apiClient.js";

const base = "/api/payment/test-payment";

export async function getPayments(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(base);
  return data;
}