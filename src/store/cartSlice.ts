import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Тип данных товара в корзине
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Тип начального состояния корзины
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Начальное состояние
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.totalItems += 1;
      state.totalPrice += product.price;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem) {
        state.totalItems -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== productId);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const quantityDiff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalItems += quantityDiff;
        state.totalPrice += quantityDiff * existingItem.price;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
