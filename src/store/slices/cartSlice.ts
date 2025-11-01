import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '@/types/api';
import { DishDto } from '@services/api/dishService';

interface CartState {
  items: OrderItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<OrderItem[]>) => {
            state.items = action.payload;
        },
        addToCart: (state, action: PayloadAction<{ dish: DishDto; quantity?: number; note?: string }>) => {
            const { dish, quantity = 1, note } = action.payload;
            const existingItemIndex = state.items.findIndex((item) => item.dishId === dish.id);

            if (existingItemIndex >= 0) {
                // Item đã tồn tại, cộng thêm quantity
                state.items[existingItemIndex].quantity += quantity;
                if (note) {
                    state.items[existingItemIndex].note = note;
                }
            } else {
                // Item mới, tạo OrderItem từ DishDto
                const newItem: OrderItem = {
                    id: Date.now(), // Tạm thời dùng timestamp làm id
                    dishId: dish.id,
                    dishName: dish.name,
                    quantity,
                    note,
                };
                state.items.push(newItem);
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.dishId !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ dishId: number; quantity: number }>) => {
            const item = state.items.find((item) => item.dishId === action.payload.dishId);
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter((item) => item.dishId !== action.payload.dishId);
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
        },
        updateNote: (state, action: PayloadAction<{ dishId: number; note?: string }>) => {
            const item = state.items.find((item) => item.dishId === action.payload.dishId);
            if (item) {
                item.note = action.payload.note;
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const {setCartItems, addToCart, removeFromCart, updateQuantity, updateNote, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
