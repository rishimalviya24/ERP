// components/ProjectForm.jsx
import React, { useState, useEffect } from 'react';
import { useProject } from '../../hooks/useProject';
import { useSelector } from 'react-redux';

const ProjectForm = ({ project, onClose }) => {
  const { createProject, updateProject, loading } = useProject();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    status: 'planning', // must match backend enum
    budget: '',
    managerId: user?._id || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        project_name: project.project_name || '',
        description: project.description || '',
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        priority: project.priority || 'medium',
        status: project.status || 'planning',
        budget: project.budget || '',
        managerId: project.managerId || user?._id || ''
      });
    }
  }, [project, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_name.trim()) newErrors.project_name = 'Project name is required';
    else if (formData.project_name.trim().length < 3) newErrors.project_name = 'Project name must be at least 3 characters';

    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start >= end) newErrors.end_date = 'End date must be after start date';
    }

    if (formData.budget && (isNaN(formData.budget) || Number(formData.budget) < 0)) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        project_name: formData.project_name.trim(),
        description: formData.description.trim(),
        project_code: project ? project.project_code : `PRJ-${Date.now()}`, // auto-generate for new
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        priority: formData.priority,
        status: formData.status, // must match backend enum
        managerId: formData.managerId || user?._id,
        ...(formData.budget ? { budget: Number(formData.budget) } : {})
      };

      console.log('Submitting project:', submitData);

      if (project) {
        await updateProject(project._id, submitData);
      } else {
        await createProject(submitData);
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      alert(error?.response?.data?.message || 'Something went wrong while submitting the project.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{project ? 'Edit Project' : 'Create New Project'}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${errors.project_name ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.project_name && <p className="mt-1 text-xs text-red-600">{errors.project_name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm ${errors.start_date ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm ${errors.end_date ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date}</p>}
          </div>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm ${errors.budget ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="0.00"
            />
          </div>
          {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
        </div>

        {/* Duration */}
        {formData.start_date && formData.end_date && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
            Duration: {Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24))} days
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Submitting...' : project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
