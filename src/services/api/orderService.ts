import apiClient from './apiClient';

export type OrderStatus = 'NEW' | 'ASSIGNED' | 'PREPARING' | 'DONE' | 'CANCELLED';

export interface OrderItemDto {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  note?: string;
}

export interface OrderDto {
  id: number;
  code?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: 'COD' | 'ONLINE' | string;
  isPaid?: boolean;
  status: OrderStatus;
  createdAt?: string;
  items: OrderItemDto[];
}

export const orderService = {
  async getOrders(params?: { status?: OrderStatus }): Promise<OrderDto[]> {
    const res = await apiClient.get('/api/order', { params });
    return (res.data?.data ?? res.data ?? []) as OrderDto[];
  },

  async getOrder(orderId: number): Promise<OrderDto> {
    const res = await apiClient.get(`/api/order/${orderId}`);
    return (res.data?.data ?? res.data) as OrderDto;
  },

  async assignOrder(orderId: number): Promise<OrderDto> {
    const res = await apiClient.post(`/api/order/${orderId}/assign`);
    return (res.data?.data ?? res.data) as OrderDto;
  },

  async updateStatus(orderId: number, status: OrderStatus): Promise<OrderDto> {
    const res = await apiClient.patch(`/api/order/${orderId}/status`, null, { params: { status } });
    return (res.data?.data ?? res.data) as OrderDto;
  },

  async confirmCOD(orderId: number): Promise<OrderDto> {
    const res = await apiClient.post(`/api/order/${orderId}/cod/confirm`);
    return (res.data?.data ?? res.data) as OrderDto;
  },

  async createOrder(payload: {
    accountId: number;
    paymentMethod: 'COD' | 'ONLINE' | string;
    note?: string;
    totalPrice: number;
    items: Array<{
      dishId: number;
      quantity: number;
      note?: string;
    }>;
  }): Promise<OrderDto> {
    const res = await apiClient.post('/api/order', {
      accountId: payload.accountId,
      paymentMethod: payload.paymentMethod,
      note: payload.note || '',
      totalPrice: payload.totalPrice,
      items: payload.items.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
        note: item.note || '',
      })),
    });
    return (res.data?.data ?? res.data) as OrderDto;
  },
};

export default orderService;
