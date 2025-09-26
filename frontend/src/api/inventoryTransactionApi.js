    // services/inventoryTransactionApi.js
import axiosInstance from "../utils/axiosInstance";

export const createInventoryTransaction = async (formData) => {
  const { data } = await axiosInstance.post("/inventory-transactions", formData);
  return data;
};

export const getAllInventoryTransactions = async () => {
  const { data } = await axiosInstance.get("/inventory-transactions");
  return data;
};

export const getInventoryTransactionById = async (id) => {
  const { data } = await axiosInstance.get(`/inventory-transactions/${id}`);
  return data;
};