// slices/inventoryTransactionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const inventoryTransactionSlice = createSlice({
  name: "inventoryTransaction",
  initialState: {
    inventoryTransactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
    totalCount: 0,
    stats: {
      totalPurchases: 0,
      totalSales: 0,
      totalAdjustments: 0,
      totalTransfers: 0,
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setInventoryTransactions: (state, action) => {
      state.inventoryTransactions = action.payload;
      state.totalCount = action.payload.length;
      state.loading = false;
      state.error = null;
      // Calculate stats
      state.stats = action.payload.reduce(
        (acc, transaction) => {
          switch (transaction.transactionType) {
            case "purchase":
              acc.totalPurchases += transaction.totalAmount;
              break;
            case "sale":
              acc.totalSales += transaction.totalAmount;
              break;
            case "adjustment":
              acc.totalAdjustments += transaction.totalAmount;
              break;
            case "transfer":
              acc.totalTransfers += transaction.totalAmount;
              break;
          }
          return acc;
        },
        { totalPurchases: 0, totalSales: 0, totalAdjustments: 0, totalTransfers: 0 }
      );
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInventoryTransaction: (state, action) => {
      state.inventoryTransactions.unshift(action.payload);
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
      // Update stats
      const transaction = action.payload;
      switch (transaction.transactionType) {
        case "purchase":
          state.stats.totalPurchases += transaction.totalAmount;
          break;
        case "sale":
          state.stats.totalSales += transaction.totalAmount;
          break;
        case "adjustment":
          state.stats.totalAdjustments += transaction.totalAmount;
          break;
        case "transfer":
          state.stats.totalTransfers += transaction.totalAmount;
          break;
      }
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setInventoryTransactions,
  setCurrentTransaction,
  addInventoryTransaction,
  clearCurrentTransaction,
  clearError
} = inventoryTransactionSlice.actions;

export default inventoryTransactionSlice.reducer;