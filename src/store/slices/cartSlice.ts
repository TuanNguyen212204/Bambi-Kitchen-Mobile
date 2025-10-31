import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '@/types/api';

interface CartState {
  items: OrderItem[];
}

const initialState: CartState = {
  items: [
    {
      id: 1,
      dishId: 101,
      dishName: 'Phở Bò Kobe',
      quantity: 1,
      note: 'Không hành',
    },
    {
      id: 2,
      dishId: 102,
      dishName: 'Cơm Tấm Sườn Bì',
      quantity: 2,
    },
  ],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<OrderItem[]>) => {
            state.items = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const {setCartItems, clearCart} = cartSlice.actions;
export default cartSlice.reducer;