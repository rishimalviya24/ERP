// slices/studentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    currentStudent: null,
    enrollments: {},
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
    setStudents: (state, action) => {
      // Handle the backend response structure { success, count, data }
      const { data, count } = action.payload;
      state.students = data || action.payload || [];
      state.totalCount = count || state.students.length;
      state.loading = false;
      state.error = null;
    },
    setCurrentStudent: (state, action) => {
      state.currentStudent = action.payload;
      state.loading = false;
      state.error = null;
    },
    addStudent: (state, action) => {
      // Handle the response structure
      const student = action.payload.data || action.payload;
      state.students.push(student);
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
    },
    updateStudentInList: (state, action) => {
      const student = action.payload.data || action.payload;
      const index = state.students.findIndex(s => s._id === student._id);
      if (index !== -1) {
        state.students[index] = student;
      }
      state.loading = false;
      state.error = null;
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(student => student._id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
      state.loading = false;
      state.error = null;
    },
    setStudentEnrollments: (state, action) => {
      const { studentId, enrollments } = action.payload;
      state.enrollments[studentId] = enrollments;
      state.loading = false;
      state.error = null;
    },
    addEnrollment: (state, action) => {
      const { studentId, batch } = action.payload;
      if (!state.enrollments[studentId]) {
        state.enrollments[studentId] = [];
      }
      state.enrollments[studentId].push(batch);
      
      // Update student's batches in the students list
      const studentIndex = state.students.findIndex(s => s._id === studentId);
      if (studentIndex !== -1) {
        if (!state.students[studentIndex].batches) {
          state.students[studentIndex].batches = [];
        }
        state.students[studentIndex].batches.push(batch);
      }
      
      state.loading = false;
      state.error = null;
    },
    removeEnrollment: (state, action) => {
      const { studentId, batchId } = action.payload;
      if (state.enrollments[studentId]) {
        state.enrollments[studentId] = state.enrollments[studentId].filter(
          batch => batch._id !== batchId
        );
      }
      
      // Update student's batches in the students list
      const studentIndex = state.students.findIndex(s => s._id === studentId);
      if (studentIndex !== -1 && state.students[studentIndex].batches) {
        state.students[studentIndex].batches = state.students[studentIndex].batches.filter(
          batch => batch._id !== batchId
        );
      }
      
      state.loading = false;
      state.error = null;
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setStudents,
  setCurrentStudent,
  addStudent,
  updateStudentInList,
  removeStudent,
  setStudentEnrollments,
  addEnrollment,
  removeEnrollment,
  clearCurrentStudent,
  clearError
} = studentSlice.actions;

export default studentSlice.reducer;