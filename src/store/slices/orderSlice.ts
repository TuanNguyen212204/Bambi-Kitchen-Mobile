import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types/api';

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        fetchOrdersStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchOrdersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addOrder(state, action: PayloadAction<Order>) {
            state.orders.unshift(action.payload);
        },
    },
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersFailure, addOrder } = orderSlice.actions;
export default orderSlice.reducer;