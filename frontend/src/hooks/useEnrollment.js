// hooks/useEnrollment.js
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLoading, 
  setError, 
  setEnrollments, 
  setMyEnrollments,
  setCurrentEnrollment, 
  addEnrollment, 
  updateEnrollmentInList, 
  removeEnrollment, 
  clearCurrentEnrollment, 
  clearError 
} from '../redux/enrollmentSlice';
import * as enrollmentApi from '../api/enrollmentApi';

export const useEnrollment = () => {
  const dispatch = useDispatch();
  const { 
    enrollments, 
    myEnrollments,
    currentEnrollment, 
    loading, 
    error, 
    totalCount, 
    stats 
  } = useSelector(state => state.enrollment);

  const createEnrollment = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await enrollmentApi.createEnrollment(formData);
      dispatch(addEnrollment(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create enrollment'));
      throw error;
    }
  };

  const fetchAllEnrollments = async () => {
    try {
      dispatch(setLoading(true));
      const response = await enrollmentApi.getAllEnrollments();
      dispatch(setEnrollments(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch enrollments'));
      throw error;
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      dispatch(setLoading(true));
      const response = await enrollmentApi.getMyEnrollments();
      dispatch(setMyEnrollments(response));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch my enrollments'));
      throw error;
    }
  };

  const updateEnrollment = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await enrollmentApi.updateEnrollment(id, formData);
      dispatch(updateEnrollmentInList(response));
      if (currentEnrollment?._id === id) {
        dispatch(setCurrentEnrollment(response.data));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update enrollment'));
      throw error;
    }
  };

  const deleteEnrollment = async (id) => {
    try {
      dispatch(setLoading(true));
      await enrollmentApi.deleteEnrollment(id);
      dispatch(removeEnrollment(id));
      if (currentEnrollment?._id === id) {
        dispatch(clearCurrentEnrollment());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete enrollment'));
      throw error;
    }
  };

  const clearEnrollmentError = () => {
    dispatch(clearError());
  };

  const clearCurrentEnrollmentData = () => {
    dispatch(clearCurrentEnrollment());
  };

  return {
    enrollments,
    myEnrollments,
    currentEnrollment,
    loading,
    error,
    totalCount,
    stats,
    createEnrollment,
    fetchAllEnrollments,
    fetchMyEnrollments,
    updateEnrollment,
    deleteEnrollment,
    clearEnrollmentError,
    clearCurrentEnrollmentData,
  };
};