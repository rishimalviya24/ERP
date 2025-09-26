// components/StudentEnrollmentModal.jsx (Updated for your backend structure)
import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import Modal from '../../components/Enrollment/Modal';
import LoadingSpinner, { ButtonSpinner } from '../../components/LoadingSpinner';
import { useStudent } from '../../hooks/useStudent';
import { useBatch } from '../../hooks/useBatch';

const StudentEnrollmentModal = ({ 
  isOpen, 
  onClose, 
  student, 
  onEnrollmentComplete 
}) => {
  const { batches, loading: batchesLoading, fetchAllBatches } = useBatch();
  const { enrollStudentInBatch, unenrollStudentFromBatch } = useStudent();
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [currentEnrollments, setCurrentEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && student) {
      fetchAllBatches();
      // Set current enrollments from student data
      const enrollments = student.batches?.map(batch => batch._id) || [];
      setCurrentEnrollments(enrollments);
      setSelectedBatches(enrollments);
      setSearchTerm('');
      setError('');
    }
  }, [isOpen, student, fetchAllBatches]);

  // Filter batches based on search term
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBatchToggle = (batchId) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredBatches.map(batch => batch._id);
    setSelectedBatches(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const getBatchStatus = (batch) => {
    const now = new Date();
    const startDate = new Date(batch.startDate);
    const endDate = new Date(batch.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'active';
  };

  const handleSaveEnrollments = async () => {
    if (!student) return;

    setProcessing(true);
    setError('');

    try {
      // Find batches to enroll (selected but not currently enrolled)
      const toEnroll = selectedBatches.filter(batchId => !currentEnrollments.includes(batchId));
      
      // Find batches to unenroll (currently enrolled but not selected)
      const toUnenroll = currentEnrollments.filter(batchId => !selectedBatches.includes(batchId));

      // Process enrollments
      await Promise.all([
        ...toEnroll.map(batchId => enrollStudentInBatch(student._id, batchId)),
        ...toUnenroll.map(batchId => unenrollStudentFromBatch(student._id, batchId))
      ]);

      onEnrollmentComplete && onEnrollmentComplete();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update enrollments');
    } finally {
      setProcessing(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(selectedBatches.sort()) !== JSON.stringify(currentEnrollments.sort());
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Manage Batch Enrollments
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                <span className="font-medium">{student?.username}</span> - Select batches to enroll the student
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

        {/* Search and Controls */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all duration-200"
            >
              {selectedBatches.length === filteredBatches.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {selectedBatches.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-sm text-indigo-800">
                <span className="font-medium">{selectedBatches.length}</span> batch{selectedBatches.length > 1 ? 'es' : ''} selected
                {hasChanges() && (
                  <span className="ml-2 text-indigo-600 font-bold">(Changes pending)</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Batches List */}
        <div className="flex-1 overflow-y-auto">
          {batchesLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="medium" fullScreen={false} text="Loading batches..." />
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'No batches are currently available for enrollment'}
              </p>
            </div>
          ) : (
            <div className="px-6 py-4">
              <div className="grid gap-4">
                {filteredBatches.map((batch) => {
                  const status = getBatchStatus(batch);
                  const isCurrentlyEnrolled = currentEnrollments.includes(batch._id);
                  const isSelected = selectedBatches.includes(batch._id);
                  
                  return (
                    <div
                      key={batch._id}
                      className={`relative rounded-lg border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      } ${
                        isCurrentlyEnrolled && !isSelected ? 'bg-red-50 border-red-200' : 
                        !isCurrentlyEnrolled && isSelected ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5 mt-1">
                            <input
                              id={`batch-${batch._id}`}
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleBatchToggle(batch._id)}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <label
                              htmlFor={`batch-${batch._id}`}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                      {batch.name || 'Unnamed Batch'}
                                    </h4>
                                    {isCurrentlyEnrolled && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Currently Enrolled
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-3">
                                    <span className="font-medium">Course:</span> {batch.course?.title || 'No course assigned'}
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span>
                                        {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                      </svg>
                                      <span>{batch.students?.length || 0} students</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <span>{batch.instructor?.username || 'No instructor'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="ml-4 text-right">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    status === 'active' ? 'bg-green-100 text-green-800' :
                                    status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
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
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{filteredBatches.length}</span> batch{filteredBatches.length !== 1 ? 'es' : ''} available
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={processing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEnrollments}
                disabled={processing || !hasChanges()}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {processing ? (
                  <div className="flex items-center">
                    <ButtonSpinner className="mr-2" />
                    Saving Changes...
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StudentEnrollmentModal;