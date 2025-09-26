// hooks/useInventoryTransaction.js
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLoading, 
  setError, 
  setInventoryTransactions, 
  setCurrentTransaction, 
  addInventoryTransaction, 
  clearCurrentTransaction, 
  clearError 
} from '../redux/inventoryTransactionSlice';
import * as inventoryTransactionApi from '../api/inventoryTransactionApi';

export const useInventoryTransaction = () => {
  const dispatch = useDispatch();
  const { 
    inventoryTransactions, 
    currentTransaction, 
    loading, 
    error, 
    totalCount, 
    stats 
  } = useSelector(state => state.inventoryTransaction);

  const createInventoryTransaction = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryTransactionApi.createInventoryTransaction(formData);
      dispatch(addInventoryTransaction(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create inventory transaction'));
      throw error;
    }
  };

  const fetchAllInventoryTransactions = async () => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryTransactionApi.getAllInventoryTransactions();
      dispatch(setInventoryTransactions(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch inventory transactions'));
      throw error;
    }
  };

  const fetchInventoryTransactionById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryTransactionApi.getInventoryTransactionById(id);
      dispatch(setCurrentTransaction(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch inventory transaction'));
      throw error;
    }
  };

  const clearInventoryTransactionError = () => {
    dispatch(clearError());
  };

  const clearCurrentTransactionData = () => {
    dispatch(clearCurrentTransaction());
  };

  return {
    inventoryTransactions,
    currentTransaction,
    loading,
    error,
    totalCount,
    stats,
    createInventoryTransaction,
    fetchAllInventoryTransactions,
    fetchInventoryTransactionById,
    clearInventoryTransactionError,
    clearCurrentTransactionData,
  };
};