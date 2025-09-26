// pages/EnrollmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useSelector } from 'react-redux';
import EnrollmentCard from '../../components/Enrollment/EnrollmentCard';
import EnrollmentForm from '../../components/Enrollment/EnrollmentForm';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const EnrollmentPage = () => {
  const { 
    enrollments,
    myEnrollments,
    loading, 
    error, 
    stats,
    fetchAllEnrollments,
    fetchMyEnrollments,
    deleteEnrollment 
  } = useEnrollment();
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState(user?.role === 'student' ? 'my' : 'all');

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        fetchAllEnrollments();
      } else if (user.role === 'student') {
        fetchMyEnrollments();
      }
    }
  }, [user]);

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await deleteEnrollment(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEnrollment(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'all') {
      fetchAllEnrollments();
    } else {
      fetchMyEnrollments();
    }
  };

  const currentEnrollments = viewMode === 'all' ? enrollments : myEnrollments;

  const filteredEnrollments = currentEnrollments.filter(enrollment => {
    const matchesSearch = enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.batch?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterBy === 'all' || enrollment.status === filterBy;
    
    return matchesSearch && matchesStatus;
  });

  const canCreateEnrollment = user && user.role === 'student';
  const canManageEnrollments = user && ['admin', 'instructor'].includes(user.role);
  const canDeleteEnrollment = user && ['admin', 'student'].includes(user.role);

  if (loading && currentEnrollments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {viewMode === 'all' ? 'All Enrollments' : 'My Enrollments'}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {viewMode === 'all' 
                    ? 'Manage student course enrollments' 
                    : 'View and manage your course enrollments'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle for Admin */}
                {user?.role === 'admin' && (
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleViewModeChange('all')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                        viewMode === 'all'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      All Enrollments
                    </button>
                    <button
                      onClick={() => handleViewModeChange('my')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                        viewMode === 'my'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      My Enrollments
                    </button>
                  </div>
                )}
                
                {canCreateEnrollment && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Enroll in Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Only for admin view */}
      {viewMode === 'all' && user?.role === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Enrolled</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalEnrolled}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalCompleted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-md">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Dropped</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalDropped}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={viewMode === 'all' ? "Search students, courses..." : "Search courses..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Enrollment Records */}
        {filteredEnrollments.length === 0 ? (
          <EmptyState 
            title="No enrollments found"
            description={searchTerm ? "Try adjusting your search criteria" : 
              viewMode === 'all' ? "No student enrollments yet" : "You haven't enrolled in any courses yet"}
            action={canCreateEnrollment && !searchTerm && viewMode === 'my' ? {
              label: "Enroll in Course",
              onClick: () => setShowModal(true)
            } : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map(enrollment => (
              <EnrollmentCard
                key={enrollment._id}
                enrollment={enrollment}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canManageEnrollments}
                canDelete={canDeleteEnrollment}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <EnrollmentForm
            enrollment={editingEnrollment}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default EnrollmentPage;