// hooks/useBatch.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  setLoading, 
  setError, 
  setBatches, 
  setCurrentBatch, 
  addBatch, 
  updateBatchInList, 
  removeBatch, 
  clearCurrentBatch, 
  clearError 
} from '../redux/batchSlice';
import * as batchApi from '../api/batchApi';

export const useBatch = () => {
  const dispatch = useDispatch();
  const { batches, currentBatch, loading, error } = useSelector(state => state.batch);

  

  const createBatch = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await batchApi.createBatch(formData);
      dispatch(addBatch(response.batch));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create batch'));
      throw error;
    }
  };

 const fetchAllBatches = useCallback(async () => {
  try {
    dispatch(setLoading(true));
    const response = await batchApi.getAllBatches();
    dispatch(setBatches(response.batches));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch batches'));
    throw error;
  }
}, [dispatch]);

  const fetchBatchById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await batchApi.getBatchById(id);
      dispatch(setCurrentBatch(response.batch));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch batch'));
      throw error;
    }
  };

  const updateBatch = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await batchApi.updateBatch(id, formData);
      dispatch(updateBatchInList(response.batch));
      if (currentBatch?._id === id) {
        dispatch(setCurrentBatch(response.batch));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update batch'));
      throw error;
    }
  };

  const deleteBatch = async (id) => {
    try {
      dispatch(setLoading(true));
      await batchApi.deleteBatch(id);
      dispatch(removeBatch(id));
      if (currentBatch?._id === id) {
        dispatch(clearCurrentBatch());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete batch'));
      throw error;
    }
  };

  const clearBatchError = () => {
    dispatch(clearError());
  };

  const clearCurrentBatchData = () => {
    dispatch(clearCurrentBatch());
  };

  return {
    batches,
    currentBatch,
    loading,
    error,
    createBatch,
    fetchAllBatches,
    fetchBatchById,
    updateBatch,
    deleteBatch,
    clearBatchError,
    clearCurrentBatchData,
  };
};