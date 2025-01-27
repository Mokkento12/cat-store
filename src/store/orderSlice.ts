// src/store/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitOrder = createAsyncThunk(
  "order/submitOrder",
  async (orderDetails: any, { getState }) => {
    const { token } = getState().auth;
    const response = await fetch("https://api.example.com/orders", {
      method: "POST",
      body: JSON.stringify(orderDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: { status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
