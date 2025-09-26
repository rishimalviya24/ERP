// hooks/useInvoice.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  setLoading, 
  setError, 
  setInvoices, 
  setCurrentInvoice, 
  addInvoice, 
  updateInvoiceInList, 
  removeInvoice, 
  clearCurrentInvoice, 
  clearError 
} from '../redux/invoiceSlice';
import * as invoiceApi from '../api/invoiceApi';

export const useInvoice = () => {
  const dispatch = useDispatch();
  const { invoices, currentInvoice, loading, error } = useSelector(state => state.invoice);

  // ✅ Create Invoice
  const createInvoice = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await invoiceApi.createInvoice(formData);
      dispatch(addInvoice(response.invoice));   // ✅ fix: sirf invoice object
      return response.invoice;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create invoice'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Get All Invoices
  const fetchAllInvoices = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await invoiceApi.getAllInvoices();
      dispatch(setInvoices(response || []));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch invoices'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Get Invoice By ID
  const fetchInvoiceById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await invoiceApi.getInvoiceById(id);
      dispatch(setCurrentInvoice(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch invoice'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Update Invoice
  const updateInvoice = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await invoiceApi.updateInvoice(id, formData);
      dispatch(updateInvoiceInList(response.invoice));
      if (currentInvoice?._id === id) {
        dispatch(setCurrentInvoice(response.invoice));
      }
      return response.invoice;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update invoice'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Delete Invoice
  const deleteInvoice = async (id) => {
    try {
      dispatch(setLoading(true));
      await invoiceApi.deleteInvoice(id);
      dispatch(removeInvoice(id));
      if (currentInvoice?._id === id) {
        dispatch(clearCurrentInvoice());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete invoice'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Download Invoice PDF
  const downloadInvoicePDF = async (id) => {
    try {
      const response = await invoiceApi.generateInvoicePDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to download invoice'));
      throw error;
    }
  };

  // ✅ Send Invoice Email
  const sendInvoiceEmail = async (id, email) => {
    try {
      dispatch(setLoading(true));
      const response = await invoiceApi.sendInvoice(id, email);
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to send invoice'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Get Invoice Status
  const getInvoiceStatus = async (id) => {
    try {
      const response = await invoiceApi.getInvoiceStatus(id);
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to get invoice status'));
      throw error;
    }
  };

  // ✅ Clear Errors
  const clearInvoiceError = () => {
    dispatch(clearError());
  };

  // ✅ Clear Current Invoice
  const clearCurrentInvoiceData = () => {
    dispatch(clearCurrentInvoice());
  };

  return {
    invoices,
    currentInvoice,
    loading,
    error,
    createInvoice,
    fetchAllInvoices,
    fetchInvoiceById,
    updateInvoice,
    deleteInvoice,
    downloadInvoicePDF,
    sendInvoiceEmail,
    getInvoiceStatus,
    clearInvoiceError,
    clearCurrentInvoiceData,
  };
};
