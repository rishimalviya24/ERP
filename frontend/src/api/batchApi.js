// services/batchApi.js
import axiosInstance from "../utils/axiosInstance";

export const createBatch = async (formData) => {
  const { data } = await axiosInstance.post("/batches", formData);
  return data;
};

export const getAllBatches = async () => {
  const { data } = await axiosInstance.get("/batches");
  return data;
};

export const getBatchById = async (id) => {
  const { data } = await axiosInstance.get(`/batches/${id}`);
  return data;
};

export const updateBatch = async (id, formData) => {
  const { data } = await axiosInstance.put(`/batches/${id}`, formData);
  return data;
};

export const deleteBatch = async (id) => {
  const { data } = await axiosInstance.delete(`/batches/${id}`);
  return data;
};