// services/projectApi.js
import axiosInstance from "../utils/axiosInstance";

// Project CRUD operations
export const createProject = async (formData) => {
  const { data } = await axiosInstance.post("/projects", formData);
  return data;
};

export const getAllProjects = async () => {
  const { data } = await axiosInstance.get("/projects");
  return data;
};

export const getProjectById = async (id) => {
  const { data } = await axiosInstance.get(`/projects/${id}`);
  return data;
};

export const updateProject = async (id, formData) => {
  const { data } = await axiosInstance.put(`/projects/${id}`, formData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await axiosInstance.delete(`/projects/${id}`);
  return data;
};

// Employee assignment operations
export const assignEmployeeToProject = async (projectId, employeeId) => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/assign`, { employeeId });
  return data;
};

export const removeEmployeeFromProject = async (projectId, employeeId) => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/remove`, { employeeId });
  return data;
};

export const getProjectEmployees = async (projectId) => {
  const { data } = await axiosInstance.get(`/projects/${projectId}/employees`);
  return data;
};

export const getEmployeeProjects = async (employeeId) => {
  const { data } = await axiosInstance.get(`/employees/${employeeId}/projects`);
  return data;
};

// Bulk assignment operations
export const bulkAssignEmployees = async (projectId, employeeIds) => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/bulk-assign`, { employeeIds });
  return data;
};

export const bulkRemoveEmployees = async (projectId, employeeIds) => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/bulk-remove`, { employeeIds });
  return data;
};