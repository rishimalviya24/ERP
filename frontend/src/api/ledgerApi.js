// services/ledgerApi.js
import axiosInstance from "../utils/axiosInstance";

const noCacheHeaders = { headers: { "Cache-Control": "no-cache" } };

// Ledger Entry APIs
export const createLedgerEntry = async (formData) => {
  const { data } = await axiosInstance.post("/ledger-entries", formData);
  return data;
};

export const getAllLedgerEntries = async () => {
  const { data } = await axiosInstance.get("/ledger-entries", noCacheHeaders);
  return data;
};

export const getLedgerEntryById = async (id) => {
  const { data } = await axiosInstance.get(`/ledger-entries/${id}`, noCacheHeaders);
  return data;
};

export const updateLedgerEntry = async (id, formData) => {
  const { data } = await axiosInstance.put(`/ledger-entries/${id}`, formData);
  return data;
};

export const deleteLedgerEntry = async (id) => {
  const { data } = await axiosInstance.delete(`/ledger-entries/${id}`);
  return data;
};

// Ledger Line APIs
export const addLedgerLine = async (formData) => {
  const { data } = await axiosInstance.post("/ledger-lines", formData);
  return data;
};

export const getLedgerLinesByEntry = async (entryId) => {
  const { data } = await axiosInstance.get(`/ledger-lines/${entryId}`, noCacheHeaders);
  return data;
};

export const updateLedgerLine = async (id, formData) => {
  const { data } = await axiosInstance.put(`/ledger-lines/${id}`, formData);
  return data;
};

export const deleteLedgerLine = async (id) => {
  const { data } = await axiosInstance.delete(`/ledger-lines/${id}`);
  return data;
};