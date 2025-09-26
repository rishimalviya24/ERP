// hooks/useInventoryItem.js
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLoading, 
  setError, 
  setInventoryItems, 
  setCurrentItem, 
  addInventoryItem, 
  updateInventoryItemInList, 
  removeInventoryItem, 
  clearCurrentItem, 
  clearError 
} from '../redux/inventoryItemSlice';
import * as inventoryItemApi from '../api/inventoryItemApi';

export const useInventoryItem = () => {
  const dispatch = useDispatch();
  const { 
    inventoryItems, 
    currentItem, 
    loading, 
    error, 
    totalCount, 
    lowStockItems 
  } = useSelector(state => state.inventoryItem);

  const createInventoryItem = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryItemApi.createInventoryItem(formData);
      dispatch(addInventoryItem(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create inventory item'));
      throw error;
    }
  };

  const fetchAllInventoryItems = async () => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryItemApi.getAllInventoryItems();
      dispatch(setInventoryItems(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch inventory items'));
      throw error;
    }
  };

  const fetchInventoryItemById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryItemApi.getInventoryItemById(id);
      dispatch(setCurrentItem(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch inventory item'));
      throw error;
    }
  };

  const updateInventoryItem = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await inventoryItemApi.updateInventoryItem(id, formData);
      dispatch(updateInventoryItemInList(response));
      if (currentItem?._id === id) {
        dispatch(setCurrentItem(response));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update inventory item'));
      throw error;
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      dispatch(setLoading(true));
      await inventoryItemApi.deleteInventoryItem(id);
      dispatch(removeInventoryItem(id));
      if (currentItem?._id === id) {
        dispatch(clearCurrentItem());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete inventory item'));
      throw error;
    }
  };

  const clearInventoryItemError = () => {
    dispatch(clearError());
  };

  const clearCurrentItemData = () => {
    dispatch(clearCurrentItem());
  };

  return {
    inventoryItems,
    currentItem,
    loading,
    error,
    totalCount,
    lowStockItems,
    createInventoryItem,
    fetchAllInventoryItems,
    fetchInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem,
    clearInventoryItemError,
    clearCurrentItemData,
  };
};