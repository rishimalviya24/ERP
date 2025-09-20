// components/BatchForm.jsx
import React, { useState, useEffect } from 'react';
import { useBatch } from '../../hooks/useBatch';
import { useSelector } from 'react-redux';

const BatchForm = ({ batch, onClose }) => {
  const { createBatch, updateBatch, loading } = useBatch();
  const { courses } = useSelector(state => state.course);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name || '',
        course: batch.course?._id || '',
        startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
        endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : ''
      });
    }
  }, [batch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Batch name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Batch name must be at least 3 characters';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
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
    
    // Clear error when user starts typing
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
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (batch) {
        await updateBatch(batch._id, submitData);
      } else {
        await createBatch(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getSelectedCourse = () => {
    return courses.find(course => course._id === formData.course);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {batch ? 'Edit Batch' : 'Create New Batch'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        {/* Batch Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Batch Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter batch name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Course Selection */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Course *
          </label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.course ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.course && <p className="mt-1 text-xs text-red-600">{errors.course}</p>}
          
          {/* Selected Course Info */}
          {formData.course && getSelectedCourse() && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <p className="font-medium">{getSelectedCourse().title}</p>
                <p className="text-blue-600">Duration: {getSelectedCourse().duration} hours</p>
              </div>
            </div>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
        </div>

        {/* Duration Display */}
        {formData.startDate && formData.endDate && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {batch ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              batch ? 'Update Batch' : 'Create Batch'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BatchForm;