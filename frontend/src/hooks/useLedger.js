// hooks/useLedger.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  setLoading, 
  setError, 
  setEntries, 
  setCurrentEntry, 
  setLines, 
  addEntry, 
  updateEntryInList, 
  removeEntry,
  addLine,
  updateLineInList,
  removeLine, 
  clearCurrentEntry, 
  clearError 
} from '../redux/ledgerSlice';
import * as ledgerApi from '../api/ledgerApi';

export const useLedger = () => {
  const dispatch = useDispatch();
  const { entries, currentEntry, lines, loading, error } = useSelector(state => state.ledger);

  // Ledger Entry operations
  const createLedgerEntry = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.createLedgerEntry(formData);
      dispatch(addEntry(response.data));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create ledger entry'));
      throw error;
    }
  };

  const fetchAllEntries = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.getAllLedgerEntries();
      dispatch(setEntries(response.data || []));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch ledger entries'));
      throw error;
    }
  }, [dispatch]);

  const fetchEntryById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.getLedgerEntryById(id);
      dispatch(setCurrentEntry(response.data.entry));
      dispatch(setLines(response.data.lines || []));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch ledger entry'));
      throw error;
    }
  };

  const updateLedgerEntry = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.updateLedgerEntry(id, formData);
      dispatch(updateEntryInList(response.data));
      if (currentEntry?._id === id) {
        dispatch(setCurrentEntry(response.data));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update ledger entry'));
      throw error;
    }
  };

  const deleteLedgerEntry = async (id) => {
    try {
      dispatch(setLoading(true));
      await ledgerApi.deleteLedgerEntry(id);
      dispatch(removeEntry(id));
      if (currentEntry?._id === id) {
        dispatch(clearCurrentEntry());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete ledger entry'));
      throw error;
    }
  };

  // Ledger Line operations
  const createLedgerLine = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.addLedgerLine(formData);
      dispatch(addLine(response.data));
      // Refetch the entry to update totals
      if (currentEntry) {
        await fetchEntryById(currentEntry._id);
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create ledger line'));
      throw error;
    }
  };

  const fetchLinesByEntry = async (entryId) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.getLedgerLinesByEntry(entryId);
      dispatch(setLines(response.data || []));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch ledger lines'));
      throw error;
    }
  };

  const updateLedgerLine = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await ledgerApi.updateLedgerLine(id, formData);
      dispatch(updateLineInList(response.data));
      // Refetch the entry to update totals
      if (currentEntry) {
        await fetchEntryById(currentEntry._id);
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update ledger line'));
      throw error;
    }
  };

  const deleteLedgerLine = async (id) => {
    try {
      dispatch(setLoading(true));
      await ledgerApi.deleteLedgerLine(id);
      dispatch(removeLine(id));
      // Refetch the entry to update totals
      if (currentEntry) {
        await fetchEntryById(currentEntry._id);
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete ledger line'));
      throw error;
    }
  };

  const clearLedgerError = () => {
    dispatch(clearError());
  };

  const clearCurrentEntryData = () => {
    dispatch(clearCurrentEntry());
  };

  return {
    entries,
    currentEntry,
    lines,
    loading,
    error,
    createLedgerEntry,
    fetchAllEntries,
    fetchEntryById,
    updateLedgerEntry,
    deleteLedgerEntry,
    createLedgerLine,
    fetchLinesByEntry,
    updateLedgerLine,
    deleteLedgerLine,
    clearLedgerError,
    clearCurrentEntryData,
  };
};