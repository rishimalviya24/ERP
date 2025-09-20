// slices/batchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const batchSlice = createSlice({
  name: "batch",
  initialState: {
    batches: [],
    currentBatch: null,
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
    setBatches: (state, action) => {
      state.batches = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentBatch: (state, action) => {
      state.currentBatch = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBatch: (state, action) => {
      state.batches.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateBatchInList: (state, action) => {
      const index = state.batches.findIndex(batch => batch._id === action.payload._id);
      if (index !== -1) {
        state.batches[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeBatch: (state, action) => {
      state.batches = state.batches.filter(batch => batch._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearCurrentBatch: (state) => {
      state.currentBatch = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setBatches,
  setCurrentBatch,
  addBatch,
  updateBatchInList,
  removeBatch,
  clearCurrentBatch,
  clearError
} = batchSlice.actions;

export default batchSlice.reducer;