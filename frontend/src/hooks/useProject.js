// hooks/useProject.js
import { useDispatch, useSelector } from 'react-redux';
import { 
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
  clearError 
} from '../redux/projectSlice';
import * as projectApi from '../api/projectApi';

export const useProject = () => {
  const dispatch = useDispatch();
  const { projects, currentProject, projectEmployees, loading, error } = useSelector(state => state.project);

  const createProject = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.createProject(formData);
      dispatch(addProject(response.project));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create project'));
      throw error;
    }
  };

  const fetchAllProjects = async () => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.getAllProjects();
      console.log(response)
      dispatch(setProjects(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch projects'));
      throw error;
    }
  };

  const fetchProjectById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.getProjectById(id);
      dispatch(setCurrentProject(response.project));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch project'));
      throw error;
    }
  };

  const updateProject = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.updateProject(id, formData);
      dispatch(updateProjectInList(response.project));
      if (currentProject?._id === id) {
        dispatch(setCurrentProject(response.project));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update project'));
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      dispatch(setLoading(true));
      await projectApi.deleteProject(id);
      dispatch(removeProject(id));
      if (currentProject?._id === id) {
        dispatch(clearCurrentProject());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete project'));
      throw error;
    }
  };

  // Employee assignment functions
  const assignEmployee = async (projectId, employeeId) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.assignEmployeeToProject(projectId, employeeId);
      dispatch(addEmployeeToProject({ projectId, employee: response.employee }));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to assign employee'));
      throw error;
    }
  };

  const removeEmployee = async (projectId, employeeId) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.removeEmployeeFromProject(projectId, employeeId);
      dispatch(removeEmployeeFromProject({ projectId, employeeId }));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to remove employee'));
      throw error;
    }
  };

  const fetchProjectEmployees = async (projectId) => {
    try {
      dispatch(setLoading(true));
      const response = await projectApi.getProjectEmployees(projectId);
      dispatch(setProjectEmployees({ projectId, employees: response.employees }));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch project employees'));
      throw error;
    }
  };

  const clearProjectError = () => {
    dispatch(clearError());
  };

  const clearCurrentProjectData = () => {
    dispatch(clearCurrentProject());
  };

  return {
    projects,
    currentProject,
    projectEmployees,
    loading,
    error,
    createProject,
    fetchAllProjects,
    fetchProjectById,
    updateProject,
    deleteProject,
    assignEmployee,
    removeEmployee,
    fetchProjectEmployees,
    clearProjectError,
    clearCurrentProjectData,
  };
};