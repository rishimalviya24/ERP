// components/Enrollment/EnrollmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useCourse } from '../../hooks/useCourse';
import { useBatch } from '../../hooks/useBatch';
import { useSelector } from 'react-redux';

const EnrollmentForm = ({ enrollment, onClose }) => {
  const { createEnrollment, updateEnrollment, loading } = useEnrollment();
  const { courses, fetchAllCourses } = useCourse();
  const { batches, fetchAllBatches } = useBatch();
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    student: user?.role === 'student' ? user._id : '',
    course: '',
    batch: '',
    status: 'enrolled',
  });

  // Mock students for admin - In real app, you'd fetch from users API
  const [students] = useState([
    { _id: '1', name: 'John Doe', email: 'john@example.com' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { _id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]);

  useEffect(() => {
    fetchAllCourses();
    fetchAllBatches();
    
    if (enrollment) {
      setFormData({
        student: enrollment.student?._id || '',
        course: enrollment.course?._id || '',
        batch: enrollment.batch?._id || '',
        status: enrollment.status || 'enrolled',
      });
    }
  }, [enrollment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (enrollment) {
        await updateEnrollment(enrollment._id, formData);
      } else {
        await createEnrollment(formData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const selectedCourse = courses.find(course => course._id === formData.course);
  const selectedBatch = batches.find(batch => batch._id === formData.batch);
  const selectedStudent = students.find(student => student._id === formData.student);

  // Filter batches based on selected course
  const availableBatches = formData.course 
    ? batches.filter(batch => batch.course_id === formData.course)
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'dropped':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {enrollment ? 'Edit Enrollment' : 'Enroll in Course'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Student Selection (Admin only) */}
            {user?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Student *
                </label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
                {selectedStudent && (
                  <p className="text-sm text-gray-500 mt-1">
                    Student: {selectedStudent.name} - {selectedStudent.email}
                  </p>
                )}
              </div>
            )}

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Details */}
            {selectedCourse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      {selectedCourse.title}
                    </h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>{selectedCourse.description}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Duration:</span> {selectedCourse.duration} weeks
                        </div>
                        <div>
                          <span className="font-medium">Level:</span> {selectedCourse.level}
                        </div>
                        <div>
                          <span className="font-medium">Instructor:</span> {selectedCourse.instructor?.name}
                        </div>
                        <div>
                          <span className="font-medium">Fee:</span> ₹{selectedCourse.fee?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Batch (Optional)
              </label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                disabled={!formData.course}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">No specific batch</option>
                {availableBatches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name} - {new Date(batch.start_date).toLocaleDateString('en-IN')}
                  </option>
                ))}
              </select>
              {!formData.course && (
                <p className="text-sm text-gray-500 mt-1">
                  Please select a course first to see available batches
                </p>
              )}
              {formData.course && availableBatches.length === 0 && (
                <p className="text-sm text-yellow-600 mt-1">
                  No batches available for selected course
                </p>
              )}
            </div>

            {/* Status Selection (Admin/Instructor only) */}
            {user?.role !== 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enrollment Status
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { 
                      value: 'enrolled', 
                      label: 'Enrolled', 
                      icon: (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      ),
                      description: 'Currently enrolled and active'
                    },
                    { 
                      value: 'completed', 
                      label: 'Completed', 
                      icon: (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      description: 'Successfully completed the course'
                    },
                    { 
                      value: 'dropped', 
                      label: 'Dropped', 
                      icon: (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      description: 'Discontinued the course'
                    }
                  ].map(status => (
                    <label key={status.value} className="relative">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.status === status.value
                          ? getStatusColor(status.value)
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <div className="mb-2">
                          {status.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900 mb-1">
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-500 text-center">
                          {status.description}
                        </span>
                        {formData.status === status.value && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Enrollment Summary */}
            {formData.course && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Enrollment Summary</h4>
                <div className="space-y-2 text-sm">
                  {user?.role === 'admin' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student:</span>
                      <span className="font-medium text-gray-900">
                        {selectedStudent?.name || 'Not selected'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium text-gray-900">
                      {selectedCourse?.title || 'Not selected'}
                    </span>
                  </div>
                  {selectedBatch && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch:</span>
                      <span className="font-medium text-gray-900">
                        {selectedBatch.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Fee:</span>
                    <span className="font-medium text-gray-900">
                      ₹{selectedCourse?.fee?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formData.status === 'enrolled' ? 'bg-blue-100 text-blue-800' :
                      formData.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.course || (user?.role === 'admin' && !formData.student)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Processing...' : (enrollment ? 'Update Enrollment' : 'Enroll Now')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;