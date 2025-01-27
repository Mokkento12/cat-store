import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Типизация аргументов для логина
interface LoginCredentials {
  username: string;
  password: string;
}

// Типизация ответа от сервера при логине
interface LoginResponse {
  userId: string;
  token: string;
}

// Типизация состояния авторизации
interface AuthState {
  user: string | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

// Асинхронный thunk для логина
export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials) => {
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    const data: LoginResponse = await response.json();
    return data; // { userId, token }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null; // Очистить ошибку перед новым запросом
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.user = action.payload.userId;
          state.token = action.payload.token;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
