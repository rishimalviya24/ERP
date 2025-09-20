// slices/courseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    currentCourse: null,
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
    setCourses: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateCourseInList: (state, action) => {
      const index = state.courses.findIndex(course => course._id === action.payload._id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(course => course._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setCourses,
  setCurrentCourse,
  addCourse,
  updateCourseInList,
  removeCourse,
  clearCurrentCourse,
  clearError
} = courseSlice.actions;

export default courseSlice.reducer;