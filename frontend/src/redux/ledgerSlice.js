// redux/ledgerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const ledgerSlice = createSlice({
  name: "ledger",
  initialState: {
    entries: [],
    currentEntry: null,
    lines: [],
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
    setEntries: (state, action) => {
      state.entries = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLines: (state, action) => {
      state.lines = action.payload;
      state.loading = false;
      state.error = null;
    },
    addEntry: (state, action) => {
      state.entries.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateEntryInList: (state, action) => {
      const index = state.entries.findIndex(entry => entry._id === action.payload._id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeEntry: (state, action) => {
      state.entries = state.entries.filter(entry => entry._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    addLine: (state, action) => {
      state.lines.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateLineInList: (state, action) => {
      const index = state.lines.findIndex(line => line._id === action.payload._id);
      if (index !== -1) {
        state.lines[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeLine: (state, action) => {
      state.lines = state.lines.filter(line => line._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
      state.lines = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setEntries,
  setCurrentEntry,
  setLines,
  addEntry,
  updateEntryInList,
  removeEntry,
  addLine,
  updateLineInList,
  removeLine,
  clearCurrentEntry,
  clearError
} = ledgerSlice.actions;

export default ledgerSlice.reducer;