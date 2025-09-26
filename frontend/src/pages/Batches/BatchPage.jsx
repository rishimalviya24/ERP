// pages/BatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useBatch } from '../../hooks/useBatch';
import { useCourse } from '../../hooks/useCourse';
import { useSelector } from 'react-redux';
import BatchCard from '../../components/Batches/BatchCard';
import BatchForm from '../../components/Batches/BatchForm';
import Modal from '../../components/Enrollment/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const BatchPage = () => {
  const { batches, loading, error, fetchAllBatches, deleteBatch } = useBatch();
  const { courses, fetchAllCourses } = useCourse();
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (batches.length === 0) fetchAllBatches();
    if (courses.length === 0) fetchAllCourses();
  }, [batches.length, courses.length, fetchAllBatches, fetchAllCourses]);

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await deleteBatch(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
  };

  const getBatchStatus = (batch) => {
    const now = new Date();
    const startDate = new Date(batch.startDate);
    const endDate = new Date(batch.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'active';
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          batch.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOwnership = filterBy === 'all' || 
                            (filterBy === 'my-batches' && user && batch.instructor._id === user._id);
    
    const matchesStatus = statusFilter === 'all' || getBatchStatus(batch) === statusFilter;
    
    return matchesSearch && matchesOwnership && matchesStatus;
  });

  const canCreateBatch = user && ['admin', 'instructor'].includes(user.role);

  if (loading && batches.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Batches</h1>
              <p className="mt-2 text-sm text-gray-600">Manage course batches and student groups</p>
            </div>
            {canCreateBatch && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Batch
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Ownership Filter */}
          {user && ['admin', 'instructor'].includes(user.role) && (
            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Batches</option>
                <option value="my-batches">My Batches</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Batch Grid */}
        {filteredBatches.length === 0 ? (
          <EmptyState
            title="No batches found"
            description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first batch"}
            action={canCreateBatch && !searchTerm ? { label: "Create Batch", onClick: () => setShowModal(true) } : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map(batch => (
              <BatchCard
                key={batch._id}
                batch={batch}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={user && (user.role === 'admin' || batch.instructor._id === user._id)}
                canDelete={user && user.role === 'admin'}
                status={getBatchStatus(batch)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <BatchForm
            batch={editingBatch}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default BatchPage;
