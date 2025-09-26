// services/inventoryItemApi.js
import axiosInstance from "../utils/axiosInstance";

export const createInventoryItem = async (formData) => {
  const { data } = await axiosInstance.post("/inventory-items", formData);
  return data;
};

export const getAllInventoryItems = async () => {
  const { data } = await axiosInstance.get("/inventory-items");
  return data;
};

export const getInventoryItemById = async (id) => {
  const { data } = await axiosInstance.get(`/inventory-items/${id}`);
  return data;
};

export const updateInventoryItem = async (id, formData) => {
  const { data } = await axiosInstance.put(`/inventory-items/${id}`, formData);
  return data;
};

export const deleteInventoryItem = async (id) => {
  const { data } = await axiosInstance.delete(`/inventory-items/${id}`);
  return data;
};