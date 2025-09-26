// api/enrollmentApi.js
import axiosInstance from "../utils/axiosInstance";

const noCacheHeaders = { headers: { "Cache-Control": "no-cache" } };

export const createEnrollment = async (formData) => {
  const { data } = await axiosInstance.post("/enrollments", formData);
  return data;
};

export const getAllEnrollments = async () => {
  const { data } = await axiosInstance.get("/enrollments", noCacheHeaders);
  return data;
};

export const getMyEnrollments = async () => {
  const { data } = await axiosInstance.get("/enrollments/my", noCacheHeaders);
  return data;
};

export const updateEnrollment = async (id, formData) => {
  const { data } = await axiosInstance.put(`/enrollments/${id}`, formData);
  return data;
};

export const deleteEnrollment = async (id) => {
  const { data } = await axiosInstance.delete(`/enrollments/${id}`);
  return data;
};