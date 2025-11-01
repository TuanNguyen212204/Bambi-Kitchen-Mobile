import apiClient from './apiClient';
import { MakeOrderRequest, Orders } from '@/types/api';

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

  async getOrdersByUserId(userId: number): Promise<Orders[]> {
    const res = await apiClient.get(`/api/order/user/${userId}`);
    return (res.data?.data ?? res.data ?? []) as Orders[];
  },

  async createOrder(request: MakeOrderRequest): Promise<string> {
    // Loại bỏ các field undefined để tránh backend xử lý null không đúng
    const cleanRequest: any = {
      accountId: request.accountId,
      paymentMethod: request.paymentMethod,
      totalPrice: request.totalPrice,
      items: request.items.map((item) => {
        const cleanItem: any = {
          dishId: item.dishId,
          name: item.name,
          quantity: item.quantity,
        };
        if (item.note) cleanItem.note = item.note;
        if (item.basedOnId) cleanItem.basedOnId = item.basedOnId;
        // Không gửi dishTemplate nếu không có để tránh lỗi backend
        // Backend đang cố gọi getSize() trên null object
        if (item.recipe && item.recipe.length > 0) cleanItem.recipe = item.recipe;
        return cleanItem;
      }),
    };
    if (request.note) cleanRequest.note = request.note;
    
    const res = await apiClient.post('/api/order', cleanRequest);
    return res.data?.data ?? res.data ?? '';
  },

  async updateOrder(orderUpdate: { orderId: number; comment?: string; ranking?: number }): Promise<Orders> {
    const res = await apiClient.put('/api/order', orderUpdate);
    return (res.data?.data ?? res.data) as Orders;
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
};

export default orderService;
