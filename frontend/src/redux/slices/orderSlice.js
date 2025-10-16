import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null, // For a single order
    orders: [], // For the list of user's orders
    loading: false,
    error: null,
    success: false, // To track successful order creation
  },
  reducers: {
    orderCreateRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderCreateReset: (state) => {
      state.success = false;
      state.error = null;
      state.order = null;
    },
    myOrdersListRequest: (state) => {
        state.loading = true;
        state.error = null;
    },
    myOrdersListSuccess: (state, action) => {
        state.loading = false;
        state.orders = action.payload;
    },
    myOrdersListFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
        // GET ORDER DETAILS
    orderDetailsRequest: (state) => {
        state.loading = true;
        state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
        state.loading = false;
        state.order = action.payload;
    },
    orderDetailsFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // DELIVER ORDER
    orderDeliverRequest: (state) => {
        state.loadingDeliver = true;
        state.errorDeliver = null;
    },
    orderDeliverSuccess: (state) => {
        state.loadingDeliver = false;
        state.successDeliver = true;
    },
    orderDeliverFail: (state, action) => {
        state.loadingDeliver = false;
        state.errorDeliver = action.payload;
    },
    orderDeliverReset: (state) => {
        state.successDeliver = false;
        state.errorDeliver = null;
    },
  },
});


export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
  myOrdersListRequest,
  myOrdersListSuccess,
  myOrdersListFail,
  // EXPORT NEW ACTIONS
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
  orderDeliverReset,
} = orderSlice.actions;

export default orderSlice.reducer;