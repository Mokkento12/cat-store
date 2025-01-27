import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Тип данных товара
interface Product {
  id: number;
  name: string;
  price: number;
}

// Тип начального состояния
interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Начальное состояние
const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null, // Ошибок в начале нет
};

// Асинхронный thunk для загрузки товаров
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://api.example.com/cat-products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error"; // Обрабатываем случай, когда message может быть undefined
      });
  },
});

export default productsSlice.reducer;
