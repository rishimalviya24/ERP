// services/studentApi.js
import axiosInstance from "../utils/axiosInstance";

// Student CRUD operations (working with User model with role="student")
export const getAllStudents = async () => {
  const { data } = await axiosInstance.get("/students");
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await axiosInstance.get(`/students/${id}`);
  return data;
};

export const createStudent = async (formData) => {
  const { data } = await axiosInstance.post("/students", formData);
  return data;
};

export const updateStudent = async (id, formData) => {
  const { data } = await axiosInstance.put(`/students/${id}`, formData);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await axiosInstance.delete(`/students/${id}`);
  return data;
};

// Enrollment operations
export const enrollStudentInBatch = async (studentId, batchId) => {
  const { data } = await axiosInstance.post(`/students/${studentId}/enroll`, { batchId });
  return data;
};

export const unenrollStudentFromBatch = async (studentId, batchId) => {
  const { data } = await axiosInstance.post(`/students/${studentId}/unenroll`, { batchId });
  return data;
};

export const getStudentEnrollments = async (studentId) => {
  const { data } = await axiosInstance.get(`/students/${studentId}/enrollments`);
  return data;
};

export const getBatchStudents = async (batchId) => {
  const { data } = await axiosInstance.get(`/batches/${batchId}/students`);
  return data;
};

// Bulk enrollment operations
export const bulkEnrollStudents = async (batchId, studentIds) => {
  const { data } = await axiosInstance.post(`/batches/${batchId}/bulk-enroll`, { studentIds });
  return data;
};

export const bulkUnenrollStudents = async (batchId, studentIds) => {
  const { data } = await axiosInstance.post(`/batches/${batchId}/bulk-unenroll`, { studentIds });
  return data;
};