// slices/inventoryItemSlice.js
import { createSlice } from "@reduxjs/toolkit";

const inventoryItemSlice = createSlice({
  name: "inventoryItem",
  initialState: {
    inventoryItems: [],
    currentItem: null,
    loading: false,
    error: null,
    totalCount: 0,
    lowStockItems: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setInventoryItems: (state, action) => {
      state.inventoryItems = action.payload;
      state.totalCount = action.payload.length;
      state.loading = false;
      state.error = null;
      // Calculate low stock items
      state.lowStockItems = action.payload.filter(
        item => item.currentStock <= item.minimumStockLevel
      );
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInventoryItem: (state, action) => {
      state.inventoryItems.unshift(action.payload);
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
    },
    updateInventoryItemInList: (state, action) => {
      const index = state.inventoryItems.findIndex(
        item => item._id === action.payload._id
      );
      if (index !== -1) {
        state.inventoryItems[index] = action.payload;
        // Update low stock items
        state.lowStockItems = state.inventoryItems.filter(
          item => item.currentStock <= item.minimumStockLevel
        );
      }
      state.loading = false;
      state.error = null;
    },
    removeInventoryItem: (state, action) => {
      state.inventoryItems = state.inventoryItems.filter(
        item => item._id !== action.payload
      );
      state.totalCount = Math.max(0, state.totalCount - 1);
      state.lowStockItems = state.inventoryItems.filter(
        item => item.currentStock <= item.minimumStockLevel
      );
      state.loading = false;
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setInventoryItems,
  setCurrentItem,
  addInventoryItem,
  updateInventoryItemInList,
  removeInventoryItem,
  clearCurrentItem,
  clearError
} = inventoryItemSlice.actions;

export default inventoryItemSlice.reducer;