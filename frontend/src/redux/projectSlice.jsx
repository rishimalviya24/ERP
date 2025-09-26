// slices/projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    currentProject: null,
    projectEmployees: {},
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
    setProjects: (state, action) => {
      console.log(action);
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProject: (state, action) => {
      if (!Array.isArray(state.projects)) state.projects = [];
      if (action.payload) state.projects.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateProjectInList: (state, action) => {
      const updated = action.payload;
      if (!updated || !updated._id) {
        console.warn("Invalid payload in updateProjectInList:", updated);
        return;
      }

      const index = state.projects.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        state.projects[index] = updated;
      }

      state.loading = false;
      state.error = null;
    },

    removeProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    setProjectEmployees: (state, action) => {
      const { projectId, employees } = action.payload;
      state.projectEmployees[projectId] = employees;
      state.loading = false;
      state.error = null;
    },
    addEmployeeToProject: (state, action) => {
      const { projectId, employee } = action.payload;
      if (!state.projectEmployees[projectId]) {
        state.projectEmployees[projectId] = [];
      }
      state.projectEmployees[projectId].push(employee);

      // Update project's employees in the projects list
      const projectIndex = state.projects.findIndex((p) => p._id === projectId);
      if (projectIndex !== -1) {
        if (!state.projects[projectIndex].employees) {
          state.projects[projectIndex].employees = [];
        }
        state.projects[projectIndex].employees.push(employee);
      }

      state.loading = false;
      state.error = null;
    },
    removeEmployeeFromProject: (state, action) => {
      const { projectId, employeeId } = action.payload;
      if (state.projectEmployees[projectId]) {
        state.projectEmployees[projectId] = state.projectEmployees[
          projectId
        ].filter((employee) => employee._id !== employeeId);
      }

      // Update project's employees in the projects list
      const projectIndex = state.projects.findIndex((p) => p._id === projectId);
      if (projectIndex !== -1 && state.projects[projectIndex].employees) {
        state.projects[projectIndex].employees = state.projects[
          projectIndex
        ].employees.filter((employee) => employee._id !== employeeId);
      }

      state.loading = false;
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProjects,
  setCurrentProject,
  addProject,
  updateProjectInList,
  removeProject,
  setProjectEmployees,
  addEmployeeToProject,
  removeEmployeeFromProject,
  clearCurrentProject,
  clearError,
} = projectSlice.actions;

export default projectSlice.reducer;
