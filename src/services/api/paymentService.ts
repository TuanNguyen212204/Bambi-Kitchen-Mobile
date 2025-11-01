import apiClient from "./apiClient";

const base = "/api/payment";

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
};

export default paymentService;