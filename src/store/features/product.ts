import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
};

type initialStateType = {
  products: Product[];
  loading: boolean;
  error: boolean;
};

const initialState: initialStateType = {
  products: [],
  loading: true,
  error: false,
};

const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
  const resp = await axiosInstance.get("/seller/products");
  console.log(resp.data);
  return resp.data;
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const productReducer = productSlice.reducer;
export { fetchProducts };
// export const { getProducts } = productSlice.actions;
