import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DishDto } from '@services/api/dishService';

export interface CartItem {
  dish: DishDto;
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ dish: DishDto; quantity?: number; note?: string }>
    ) => {
      const { dish, quantity = 1, note } = action.payload;
      const existingItem = state.items.find((item) => item.dish.id === dish.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        if (note) {
          existingItem.note = note;
        }
      } else {
        state.items.push({ dish, quantity, note });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.dish.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ dishId: number; quantity: number }>) => {
      const item = state.items.find((item) => item.dish.id === action.payload.dishId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((item) => item.dish.id !== action.payload.dishId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    updateNote: (state, action: PayloadAction<{ dishId: number; note?: string }>) => {
      const item = state.items.find((item) => item.dish.id === action.payload.dishId);
      if (item) {
        item.note = action.payload.note;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateNote, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
