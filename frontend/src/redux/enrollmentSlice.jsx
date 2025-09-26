// redux/enrollmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState: {
    enrollments: [],
    myEnrollments: [],
    currentEnrollment: null,
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
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMyEnrollments: (state, action) => {
      state.myEnrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentEnrollment: (state, action) => {
      state.currentEnrollment = action.payload;
      state.loading = false;
      state.error = null;
    },
    addEnrollment: (state, action) => {
      state.enrollments.push(action.payload);
      state.myEnrollments.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateEnrollmentInList: (state, action) => {
      const index = state.enrollments.findIndex(enrollment => enrollment._id === action.payload._id);
      if (index !== -1) {
        state.enrollments[index] = action.payload;
      }
      const myIndex = state.myEnrollments.findIndex(enrollment => enrollment._id === action.payload._id);
      if (myIndex !== -1) {
        state.myEnrollments[myIndex] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeEnrollment: (state, action) => {
      state.enrollments = state.enrollments.filter(enrollment => enrollment._id !== action.payload);
      state.myEnrollments = state.myEnrollments.filter(enrollment => enrollment._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearCurrentEnrollment: (state) => {
      state.currentEnrollment = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setEnrollments,
  setMyEnrollments,
  setCurrentEnrollment,
  addEnrollment,
  updateEnrollmentInList,
  removeEnrollment,
  clearCurrentEnrollment,
  clearError
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;