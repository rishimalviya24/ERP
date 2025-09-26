// services/invoiceApi.js
import axiosInstance from "../utils/axiosInstance";

const noCacheHeaders = { headers: { "Cache-Control": "no-cache" } };

export const createInvoice = async (formData) => {
  const { data } = await axiosInstance.post("/invoices", formData);
  return data;
};

export const getAllInvoices = async () => {
  const { data } = await axiosInstance.get("/invoices", noCacheHeaders);
  return data;
};

export const getInvoiceById = async (id) => {
  const { data } = await axiosInstance.get(`/invoices/${id}`, noCacheHeaders);
  return data;
};

export const updateInvoice = async (id, formData) => {
  const { data } = await axiosInstance.put(`/invoices/${id}`, formData);
  return data;
};

export const deleteInvoice = async (id) => {
  const { data } = await axiosInstance.delete(`/invoices/${id}`);
  return data;
};

export const generateInvoicePDF = async (id) => {
  const response = await axiosInstance.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
    ...noCacheHeaders
  });
  return response;
};

export const sendInvoice = async (id, email) => {
  const { data } = await axiosInstance.post(`/invoices/${id}/send`, { email });
  return data;
};

export const getInvoiceStatus = async (id) => {
  const { data } = await axiosInstance.get(`/invoices/${id}/status`, noCacheHeaders);
  return data;
};