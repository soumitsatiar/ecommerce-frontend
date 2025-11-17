import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/auth";
import { productsReducer } from "./features/products";
import { productReducer } from "./features/product";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
