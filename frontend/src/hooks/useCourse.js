// hooks/useCourse.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react'; // top me import karo
import { 
  setLoading, 
  setError, 
  setCourses, 
  setCurrentCourse, 
  addCourse, 
  updateCourseInList, 
  removeCourse, 
  clearCurrentCourse, 
  clearError 
} from '../redux/courseSlice';
import * as courseApi from '../api/courseApi';

export const useCourse = () => {
  const dispatch = useDispatch();
  const { courses, currentCourse, loading, error } = useSelector(state => state.course);

  const createCourse = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await courseApi.createCourse(formData);
      dispatch(addCourse(response.course));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to create course'));
      throw error;
    }
  };

const fetchAllCourses = useCallback(async () => {
  try {
    dispatch(setLoading(true));
    const response = await courseApi.getAllCourses();
    dispatch(setCourses(response.courses));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch courses'));
    throw error;
  }
}, [dispatch]);


  const fetchCourseById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await courseApi.getCourseById(id);
      dispatch(setCurrentCourse(response.course));
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch course'));
      throw error;
    }
  };

  const updateCourse = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await courseApi.updateCourse(id, formData);
      dispatch(updateCourseInList(response.course));
      if (currentCourse?._id === id) {
        dispatch(setCurrentCourse(response.course));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to update course'));
      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      dispatch(setLoading(true));
      await courseApi.deleteCourse(id);
      dispatch(removeCourse(id));
      if (currentCourse?._id === id) {
        dispatch(clearCurrentCourse());
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete course'));
      throw error;
    }
  };

  const clearCourseError = () => {
    dispatch(clearError());
  };

  const clearCurrentCourseData = () => {
    dispatch(clearCurrentCourse());
  };

  return {
    courses,
    currentCourse,
    loading,
    error,
    createCourse,
    fetchAllCourses,
    fetchCourseById,
    updateCourse,
    deleteCourse,
    clearCourseError,
    clearCurrentCourseData,
  };
};