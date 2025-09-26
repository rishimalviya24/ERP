// components/AttendanceForm.jsx
import React, { useState, useEffect } from 'react';
import useAttendance from '../../hooks/useAttendance';
import { useStudent } from '../../hooks/useStudent';
import { useBatch } from '../../hooks/useBatch';
import { useProject } from '../../hooks/useProject';

const AttendanceForm = ({ record, onClose, onSuccess }) => {
  const { createAttendance, updateAttendance, loading } = useAttendance();
  const { students, fetchAllStudents } = useStudent();
  const { batches, fetchAllBatches } = useBatch();
  const { projects, fetchAllProjects } = useProject();
  
  const [formData, setFormData] = useState({
    user_id: '',
    batch_id: '',
    project_id: '',
    attendance_date: new Date().toISOString().split('T')[0],
    status: 'present'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllStudents();
    fetchAllBatches();
    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (record) {
      setFormData({
        user_id: record.user?._id || '',
        batch_id: record.batch?._id || '',
        project_id: record.project?._id || '',
        attendance_date: record.attendance_date ? new Date(record.attendance_date).toISOString().split('T')[0] : '',
        status: record.status || 'present'
      });
    }
  }, [record]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    if (!formData.batch_id && !formData.project_id) {
      newErrors.batch_id = 'Please select either a batch or project';
    }

    if (!formData.attendance_date) {
      newErrors.attendance_date = 'Attendance date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Please select attendance status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        // Remove empty project_id if not selected
        project_id: formData.project_id || undefined
      };

      if (record) {
        await updateAttendance(record._id, submitData);
      } else {
        await createAttendance(submitData);
      }
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Show loading state if data is still loading
  if (!students || !batches || !projects) {
    return (
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {record ? 'Edit Attendance' : 'Mark Attendance'}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Loading form data...</p>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-100 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600 mt-2">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {record ? 'Edit Attendance' : 'Mark Attendance'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {record ? 'Update attendance record' : 'Create new attendance record'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-100 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
        {/* User Selection */}
        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
            User *
          </label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.user_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a user</option>
            {/* ✅ Fixed: Added null safety check with default empty array */}
            {(students || []).map(student => (
              <option key={student._id} value={student._id}>
                {student.username || student.name} ({student.role})
              </option>
            ))}
          </select>
          {errors.user_id && <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>}
        </div>

        {/* Batch Selection */}
        <div>
          <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <select
            id="batch_id"
            name="batch_id"
            value={formData.batch_id}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.batch_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a batch (optional)</option>
            {/* ✅ Fixed: Added null safety check with default empty array */}
            {(batches || []).map(batch => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </select>
          {errors.batch_id && <p className="mt-1 text-xs text-red-600">{errors.batch_id}</p>}
        </div>

        {/* Project Selection */}
        <div>
          <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a project (optional)</option>
            {/* ✅ Fixed: Added null safety check with default empty array */}
            {(projects || []).map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="attendance_date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="attendance_date"
            name="attendance_date"
            value={formData.attendance_date}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.attendance_date ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.attendance_date && <p className="mt-1 text-xs text-red-600">{errors.attendance_date}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {record ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              record ? 'Update Attendance' : 'Mark Attendance'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;