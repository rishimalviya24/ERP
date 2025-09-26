// components/EnrollmentModal.jsx
import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import Modal from '../../components/commong/Modal';
import LoadingSpinner, { ButtonSpinner } from '../LoadingSpinner';
import { useStudent } from '../../hooks/useStudent';

const EnrollmentModal = ({ 
  isOpen, 
  onClose, 
  batch, 
  onEnrollmentComplete 
}) => {
  const { students, loading: studentsLoading, fetchAllStudents, enrollStudentInBatch } = useStudent();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAllStudents();
      setSelectedStudents([]);
      setSearchTerm('');
      setError('');
    }
  }, [isOpen, fetchAllStudents]);

  // Filter students not already enrolled in this batch
  const availableStudents = students.filter(student => {
    const isAlreadyEnrolled = batch?.students?.some(enrolled => enrolled._id === student._id) || false;
    const matchesSearch = student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadyEnrolled && matchesSearch;
  });

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const allIds = availableStudents.map(student => student._id);
    setSelectedStudents(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const handleEnrollment = async () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student to enroll');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      // Enroll each selected student
      await Promise.all(
        selectedStudents.map(studentId => 
          enrollStudentInBatch(studentId, batch._id)
        )
      );

      onEnrollmentComplete && onEnrollmentComplete();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to enroll students');
    } finally {
      setEnrolling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Enroll Students
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Add students to {batch?.name}
              </p>
            </div>
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

        {/* Search and Controls */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
            >
              {selectedStudents.length === availableStudents.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {selectedStudents.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3">
              <p className="text-sm text-indigo-800">
                {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected for enrollment
              </p>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto">
          {studentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="medium" fullScreen={false} text="Loading students..." />
            </div>
          ) : availableStudents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-500">
                {searchTerm ? 'No students found matching your search' : 'No students available for enrollment'}
              </p>
            </div>
          ) : (
            <div className="px-6 py-2">
              {availableStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center h-5">
                    <input
                      id={`student-${student._id}`}
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleStudentToggle(student._id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor={`student-${student._id}`}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {student.role === 'student' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Student
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {availableStudents.length} student{availableStudents.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={enrolling}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollment}
                disabled={enrolling || selectedStudents.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {enrolling ? (
                  <div className="flex items-center">
                    <ButtonSpinner className="mr-2" />
                    Enrolling...
                  </div>
                ) : (
                  `Enroll ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EnrollmentModal;