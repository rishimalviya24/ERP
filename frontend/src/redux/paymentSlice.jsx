import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentApi } from "../api/paymentApi";

export const createPaymentOrder = createAsyncThunk(
  "payment/create-order",
  async (invoiceId, { rejectWithValue }) => {
    try {
      return await paymentApi.createPayment(invoiceId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await paymentApi.verifyPayment(paymentData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchHistory",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      return await paymentApi.getPaymentHistory(page, limit);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    currentOrder: null,
    paymentHistory: {
      payments: [],
      pagination: null,
    },
    loading: false,
    verifying: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.verifying = false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.data;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearError, clearCurrentOrder } = paymentSlice.actions;
export default paymentSlice.reducer;
