// services/attendanceApi.js
import axiosInstance from "../utils/axiosInstance";

// Attendance CRUD operations
export const createAttendance = async (formData) => {
  const { data } = await axiosInstance.post("/attendance", formData);
  return data;
};

export const getAllAttendance = async () => {
  const { data } = await axiosInstance.get("/attendance");
  return data;
};

export const getAttendanceById = async (id) => {
  const { data } = await axiosInstance.get(`/attendance/${id}`);
  return data;
};

export const getUserAttendance = async (userId) => {
  const { data } = await axiosInstance.get(`/attendance/user/${userId}`);
  return data;
};

export const updateAttendance = async (id, formData) => {
  const { data } = await axiosInstance.put(`/attendance/${id}`, formData);
  return data;
};

export const deleteAttendance = async (id) => {
  const { data } = await axiosInstance.delete(`/attendance/${id}`);
  return data;
};

// Bulk attendance operations
export const createBulkAttendance = async (attendanceRecords) => {
  const { data } = await axiosInstance.post("/attendance/bulk", { records: attendanceRecords });
  return data;
};

// Analytics endpoints
export const getAttendanceStats = async (filters = {}) => {
  const { data } = await axiosInstance.get("/attendance/stats", { params: filters });
  return data;
};

export const getBatchAttendance = async (batchId, date) => {
  const { data } = await axiosInstance.get(`/attendance/batch/${batchId}`, { 
    params: { date } 
  });
  return data;
};

export const getProjectAttendance = async (projectId, date) => {
  const { data } = await axiosInstance.get(`/attendance/project/${projectId}`, { 
    params: { date } 
  });
  return data;
};