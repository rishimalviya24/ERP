// hooks/useStudent.js
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLoading, 
  setError, 
  setStudents, 
  setCurrentStudent, 
  addStudent, 
  updateStudentInList, 
  removeStudent,
  setStudentEnrollments,
  addEnrollment,
  removeEnrollment,
  clearCurrentStudent, 
  clearError 
} from '../redux/studentSlice';
import * as studentApi from '../api/studentApi';

export const useStudent = () => {
  const dispatch = useDispatch();
  const { students, currentStudent, enrollments, loading, error, totalCount } = useSelector(state => state.student);

  const createStudent = async (formData) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.createStudent(formData);
      dispatch(addStudent(response));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const fetchAllStudents = async () => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.getAllStudents();
      
      // Handle the backend response structure { success: true, count: X, data: [...] }
      if (response.success) {
        dispatch(setStudents({
          data: response.data,
          count: response.count
        }));
      } else {
        // Fallback for different response structure
        dispatch(setStudents({
          data: response.students || response.data || response,
          count: response.count || (response.students || response.data || response).length
        }));
      }
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const fetchStudentById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.getStudentById(id);
      const student = response.data || response.student || response;
      dispatch(setCurrentStudent(student));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const updateStudent = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.updateStudent(id, formData);
      const student = response.data || response.student || response;
      dispatch(updateStudentInList(student));
      
      if (currentStudent?._id === id) {
        dispatch(setCurrentStudent(student));
      }
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      dispatch(setLoading(true));
      await studentApi.deleteStudent(id);
      dispatch(removeStudent(id));
      
      if (currentStudent?._id === id) {
        dispatch(clearCurrentStudent());
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  // Enrollment functions
  const enrollStudentInBatch = async (studentId, batchId) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.enrollStudentInBatch(studentId, batchId);
      const batch = response.data || response.batch || response;
      dispatch(addEnrollment({ studentId, batch }));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to enroll student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const unenrollStudentFromBatch = async (studentId, batchId) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.unenrollStudentFromBatch(studentId, batchId);
      dispatch(removeEnrollment({ studentId, batchId }));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unenroll student';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const fetchStudentEnrollments = async (studentId) => {
    try {
      dispatch(setLoading(true));
      const response = await studentApi.getStudentEnrollments(studentId);
      const enrollments = response.data || response.enrollments || response;
      dispatch(setStudentEnrollments({ studentId, enrollments }));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch enrollments';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const clearStudentError = () => {
    dispatch(clearError());
  };

  const clearCurrentStudentData = () => {
    dispatch(clearCurrentStudent());
  };

  return {
    students,
    currentStudent,
    enrollments,
    loading,
    error,
    totalCount,
    createStudent,
    fetchAllStudents,
    fetchStudentById,
    updateStudent,
    deleteStudent,
    enrollStudentInBatch,
    unenrollStudentFromBatch,
    fetchStudentEnrollments,
    clearStudentError,
    clearCurrentStudentData,
  };
};