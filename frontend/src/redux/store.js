import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice'; // <-- IMPORT

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer, // <-- ADD THE REDUCER
  },
});

export default store;