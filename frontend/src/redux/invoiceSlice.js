// redux/invoiceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateInvoiceInList: (state, action) => {
      const index = state.invoices.findIndex(invoice => invoice._id === action.payload._id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeInvoice: (state, action) => {
      state.invoices = state.invoices.filter(invoice => invoice._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setInvoices,
  setCurrentInvoice,
  addInvoice,
  updateInvoiceInList,
  removeInvoice,
  clearCurrentInvoice,
  clearError
} = invoiceSlice.actions;

export default invoiceSlice.reducer;