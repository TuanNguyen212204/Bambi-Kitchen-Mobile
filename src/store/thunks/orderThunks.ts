import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '@/types/api.js';
import {
    fetchOrdersStart,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    addOrder,
} from '../slices/orderSlice.js';

const ORDER_KEY = '@orders';

export const saveOrderThunk = createAsyncThunk(
    'order/saveOrder',
    async (order: Omit<Order, 'id'>, { dispatch }) => {
        try {
            const existing = await AsyncStorage.getItem(ORDER_KEY);
            const orders: Order[] = existing ? JSON.parse(existing) : [];
            const newOrder: Order = {
                ...order,
                id: Date.now().toString(),
            };
            orders.unshift(newOrder);
            await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(orders));
            dispatch(addOrder(newOrder));
            return newOrder;
        } catch (error) {
            throw new Error('Lưu đơn hàng thất bại');
        }
     }
);

export const fetchOrdersThunk = createAsyncThunk(
    'order/fetchOrders',
    async (_, { dispatch }) => {
        dispatch(fetchOrdersStart());
        try {
            const existing = await AsyncStorage.getItem(ORDER_KEY);
            const orders: Order[] = existing ? JSON.parse(existing) : [];
            dispatch(fetchOrdersSuccess(orders));
            return orders;
        } catch (error) {
            const errorMessage = 'Lấy đơn hàng thất bại';
            dispatch(fetchOrdersFailure(errorMessage));
            throw new Error(errorMessage);
        }
    }
)