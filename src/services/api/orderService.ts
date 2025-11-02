import apiClient from './apiClient';
import { MakeOrderRequest, Orders } from '@/types/api';

// Legacy types kept for backward compatibility (old API)
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
  async getOrders(): Promise<Orders[]> {
    // GET /api/order - lấy tất cả orders (API v3)
    const res = await apiClient.get('/api/order');
    return (res.data?.data ?? res.data ?? []) as Orders[];
  },

  async getOrder(orderId: number): Promise<OrderDto> {
    const res = await apiClient.get(`/api/order/${orderId}`);
    return (res.data?.data ?? res.data) as OrderDto;
  },

  async getOrdersByUserId(userId: number): Promise<Orders[]> {
    const res = await apiClient.get(`/api/order/user/${userId}`);
    return (res.data?.data ?? res.data ?? []) as Orders[];
  },

  async getOrderById(orderId: number): Promise<Orders> {
    const res = await apiClient.get(`/api/order/${orderId}`);
    return (res.data?.data ?? res.data) as Orders;
  },

  async submitFeedback(orderUpdate: { orderId: number; comment?: string; ranking?: number }): Promise<Orders> {
    const res = await apiClient.put('/api/order/feedback', orderUpdate);
    return (res.data?.data ?? res.data) as Orders;
  },

  async getFeedbacks(): Promise<any[]> {
    const res = await apiClient.get('/api/order/getFeedbacks');
    return (res.data?.data ?? res.data ?? []) as any[];
  },

  async createOrder(request: MakeOrderRequest): Promise<string> {
    // Build request payload theo format API v3
    // QUAN TRỌNG: KHÔNG gửi dishTemplate nếu không có size hợp lệ
    // Backend sẽ lỗi nếu gọi getDishTemplate().getSize() khi dishTemplate = null
    const cleanRequest: any = {
      accountId: request.accountId,
      paymentMethod: request.paymentMethod,
      totalPrice: request.totalPrice,
      items: request.items.map((item) => {
        const cleanItem: any = {
          name: item.name,
          quantity: item.quantity,
          recipe: item.recipe || [], // Luôn gửi recipe (có thể là empty array)
        };
        
        // dishId: chỉ có khi là preset dish
        if (item.dishId !== undefined && item.dishId !== null) {
          cleanItem.dishId = item.dishId;
        }
        
        // basedOnId: ID của dish gốc (cho preset dish đã chỉnh sửa)
        if (item.basedOnId !== undefined && item.basedOnId !== null) {
          cleanItem.basedOnId = item.basedOnId;
        }
        
        // dishTemplate: Backend YÊU CẦU cho MỌI item (kể cả preset dish)
        // Nếu có dishTemplate và size hợp lệ → dùng nó
        // Nếu không có → dùng default size "M"
        if (item.dishTemplate && 
            item.dishTemplate.size && 
            ['S', 'M', 'L'].includes(item.dishTemplate.size)) {
          cleanItem.dishTemplate = {
            size: item.dishTemplate.size,
          };
        } else {
          // Backend require dishTemplate cho mọi item, set default "M"
          cleanItem.dishTemplate = {
            size: 'M',
          };
        }
        
        // note: Ghi chú của user (optional)
        if (item.note && item.note.trim()) {
          cleanItem.note = item.note.trim();
        }
        
        return cleanItem;
      }),
    };
    
    // note: Ghi chú cho toàn bộ order (optional)
    if (request.note && request.note.trim()) {
      cleanRequest.note = request.note.trim();
    }
    
    // Log để debug (chỉ trong dev)
    if (__DEV__) {
      console.log('[ORDER] Creating order with payload:', JSON.stringify(cleanRequest, null, 2));
    }
    
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
