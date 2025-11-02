import apiClient from "./apiClient";

const base = "/api/payment";

export interface Payment {
  orderId: number;
  accountId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  transactionId?: string;
  note?: string;
}

export const paymentService = {
  async testPayment(paymentMethodName: string): Promise<string> {
    const res = await apiClient.get(`${base}/test-payment`, {
      params: { paymentMethodName },
    });
    return res.data?.data ?? res.data ?? '';
  },

  async handleVnPayReturn(params: Record<string, string>): Promise<string> {
    const res = await apiClient.get(`${base}/vnpay-return`, {
      params,
    });
    return res.data?.data ?? res.data ?? '';
  },

  async handleMomoReturn(params: Record<string, string>): Promise<any> {
    const res = await apiClient.get(`${base}/momo-return`, {
      params,
    });
    return res.data?.data ?? res.data ?? {};
  },

  async getTotalRevenueToAccount(accountId: number): Promise<Payment[]> {
    const res = await apiClient.get<Payment[]>(`${base}/to-account/${accountId}`);
    return (res.data?.data ?? res.data ?? []) as Payment[];
  },
};

export default paymentService;