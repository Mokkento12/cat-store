import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Импорт RootState для типизации getState

interface OrderResponse {
  orderId: string;
  status: string; // Например, "confirmed" | "pending" | "failed"
  message: string;
}

// Типизация деталей заказа
interface OrderDetails {
  productId: string;
  quantity: number;
  address: string;
}

// Типизация состояния заказа
interface OrderState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Начальное состояние
const initialState: OrderState = {
  status: "idle",
  error: null,
};

// Асинхронный thunk для отправки заказа
export const submitOrder = createAsyncThunk<
  OrderResponse, // Тип данных, которые возвращает сервер
  OrderDetails, // Тип параметров, передаваемых в thunk
  { state: RootState } // Типизация метода getState
>("order/submitOrder", async (orderDetails, { getState }) => {
  const { token } = getState().auth; // Получение токена из auth

  const response = await fetch("https://api.example.com/orders", {
    method: "POST",
    body: JSON.stringify(orderDetails),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to submit the order");
  }

  const data: OrderResponse = await response.json();
  return data;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "loading";
        state.error = null; // Очищаем ошибку при новом запросе
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error"; // Корректный доступ к свойству message
      });
  },
});

export default orderSlice.reducer;
