import { createSlice } from "@reduxjs/toolkit";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "SELLER";
};

type initialStateType = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: initialStateType = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { login, logout } = authSlice.actions;
