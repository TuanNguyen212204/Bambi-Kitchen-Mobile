import { createAsyncThunk } from '@reduxjs/toolkit';
import { Orders } from '@/types/api';
import orderService from '@/services/api/orderService';
import {
    fetchOrdersStart,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    addOrder,
} from '../slices/orderSlice';

export const fetchOrdersThunk = createAsyncThunk(
    'order/fetchOrders',
    async (userId: number, { dispatch }) => {
        dispatch(fetchOrdersStart());
        try {
            const orders = await orderService.getOrdersByUserId(userId);
            dispatch(fetchOrdersSuccess(orders));
            return orders;
        } catch (error: any) {
            const errorMessage = error?.message || 'Lấy đơn hàng thất bại';
            dispatch(fetchOrdersFailure(errorMessage));
            throw new Error(errorMessage);
        }
    }
);