// services/courseApi.js
import axiosInstance from "../utils/axiosInstance";

const noCacheHeaders = { headers: { "Cache-Control": "no-cache" } };

export const createCourse = async (formData) => {
  const { data } = await axiosInstance.post("/courses", formData);
  return data;
};

export const getAllCourses = async () => {
  const { data } = await axiosInstance.get("/courses", noCacheHeaders);
  return data;
};

export const getCourseById = async (id) => {
  const { data } = await axiosInstance.get(`/courses/${id}`, noCacheHeaders);
  return data;
};

export const updateCourse = async (id, formData) => {
  const { data } = await axiosInstance.put(`/courses/${id}`, formData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await axiosInstance.delete(`/courses/${id}`);
  return data;
};
