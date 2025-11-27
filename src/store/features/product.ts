import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "..";

type Product = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  body: string;
  tag: {
    id: string;
    name: string;
  };
  imageUrl: string[];
};

type initialStateType = {
  product: Product | null;
  loading: boolean;
  error: boolean;
};

const initialState: initialStateType = {
  product: null,
  loading: true,
  error: false,
};

const fetchProduct = createAsyncThunk(
  "prod/fetchProduct",
  async (productId: string) => {
    const resp = await axiosInstance.get(`/seller/product/${productId}`);
    return resp.data;
  }
);

const productSlice = createSlice({
  name: "prod",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const getProduct = (state: RootState) => state.product;
export const productReducer = productSlice.reducer;
export { fetchProduct };
