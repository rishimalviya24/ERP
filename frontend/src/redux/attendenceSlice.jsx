// slices/attendanceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendanceRecords: [],
    currentRecord: null,
    userAttendance: {},
    stats: {},
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAttendanceRecords: (state, action) => {
      // Handle the backend response structure { success, count, data }
      const { data, count } = action.payload;
      state.attendanceRecords = data || action.payload || [];
      state.totalCount = count || state.attendanceRecords.length;
      state.loading = false;
      state.error = null;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAttendanceRecord: (state, action) => {
      const record = action.payload.data || action.payload;
      state.attendanceRecords.unshift(record); // Add to beginning for latest first
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
    },
    updateAttendanceRecord: (state, action) => {
      const record = action.payload.data || action.payload;
      const index = state.attendanceRecords.findIndex(r => r._id === record._id);
      if (index !== -1) {
        state.attendanceRecords[index] = record;
      }
      state.loading = false;
      state.error = null;
    },
    removeAttendanceRecord: (state, action) => {
      state.attendanceRecords = state.attendanceRecords.filter(record => record._id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
      state.loading = false;
      state.error = null;
    },
    setUserAttendance: (state, action) => {
      const { userId, records } = action.payload;
      state.userAttendance[userId] = records;
      state.loading = false;
      state.error = null;
    },
    setAttendanceStats: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBulkAttendance: (state, action) => {
      const records = action.payload.data || action.payload;
      state.attendanceRecords = [...records, ...state.attendanceRecords];
      state.totalCount += records.length;
      state.loading = false;
      state.error = null;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setAttendanceRecords,
  setCurrentRecord,
  addAttendanceRecord,
  updateAttendanceRecord,
  removeAttendanceRecord,
  setUserAttendance,
  setAttendanceStats,
  addBulkAttendance,
  clearCurrentRecord,
  clearError
} = attendanceSlice.actions;

export default attendanceSlice.reducer;