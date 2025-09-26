// pages/StudentPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStudent } from '../../hooks/useStudent';
import StudentCard from '../students/StudentCard';
import StudentForm from '../../components/Students/StudentForm';
import StudentEnrollmentModal from '../enrollments/StudentEnrollmentModal';
import Modal from '../../components/Enrollment/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState, { NoDataFound, NoSearchResults } from '../../components/EmptyState';

const StudentPage = () => {
  const { students, loading, error, totalCount, fetchAllStudents, deleteStudent } = useStudent();
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedStudentForEnrollment, setSelectedStudentForEnrollment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student? This will also remove them from all enrolled batches.')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleEnrollment = (student) => {
    setSelectedStudentForEnrollment(student);
    setShowEnrollmentModal(true);
  };

  const handleCloseEnrollmentModal = () => {
    setShowEnrollmentModal(false);
    setSelectedStudentForEnrollment(null);
  };

  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter - only show students or filter by specific roles
    const matchesRole = filterBy === 'all' || 
                       (filterBy === 'student' && student.role === 'student') ||
                       (filterBy === 'instructor' && student.role === 'instructor') ||
                       (filterBy === 'admin' && student.role === 'admin') ||
                       (filterBy === 'accountant' && student.role === 'accountant') ||
                       (filterBy === 'employee' && student.role === 'employee');
    
    // Enrollment filter
    let matchesEnrollment = true;
    if (enrollmentFilter === 'enrolled') {
      matchesEnrollment = student.batches && student.batches.length > 0;
    } else if (enrollmentFilter === 'not-enrolled') {
      matchesEnrollment = !student.batches || student.batches.length === 0;
    }
    
    return matchesSearch && matchesRole && matchesEnrollment;
  });

  const canManageStudents = user && ['admin', 'instructor'].includes(user.role);

  // Calculate stats
  const stats = {
    total: totalCount || students.length,
    active: students.filter(s => s.status === 'active').length,
    enrolled: students.filter(s => s.batches && s.batches.length > 0).length,
    notEnrolled: students.filter(s => !s.batches || s.batches.length === 0).length
  };

  if (loading && students.length === 0) {
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
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage student enrollment and information
                </p>
              </div>
              {canManageStudents && (
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Student
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enrolled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Not Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notEnrolled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
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

            {/* Role Filter */}
            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
                <option value="admin">Admins</option>
                <option value="accountant">Accountants</option>
                <option value="employee">Employees</option>
              </select>
            </div>

            {/* Enrollment Filter */}
            <div>
              <select
                value={enrollmentFilter}
                onChange={(e) => setEnrollmentFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Students</option>
                <option value="enrolled">Enrolled</option>
                <option value="not-enrolled">Not Enrolled</option>
              </select>
            </div>

            {/* Stats Display */}
            <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 py-2">
              <span className="text-sm text-gray-600">
                Showing: <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{stats.total}</span>
              </span>
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

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          searchTerm || filterBy !== 'all' || enrollmentFilter !== 'all' ? (
            <NoSearchResults 
              searchTerm={searchTerm}
              onClearSearch={() => {
                setSearchTerm('');
                setFilterBy('all');
                setEnrollmentFilter('all');
              }}
            />
          ) : (
            <NoDataFound 
              entityName="students"
              action={canManageStudents ? {
                label: "Add Student",
                onClick: () => setShowModal(true)
              } : null}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <StudentCard
                key={student._id}
                student={student}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEnroll={handleEnrollment}
                canEdit={canManageStudents}
                canDelete={user && user.role === 'admin'}
                canEnroll={canManageStudents && student.role === 'student'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Student Form Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <StudentForm
            student={editingStudent}
            onClose={handleCloseModal}
          />
        </Modal>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <StudentEnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={handleCloseEnrollmentModal}
          student={selectedStudentForEnrollment}
          onEnrollmentComplete={fetchAllStudents}
        />
      )}
    </div>
  );
};

export default StudentPage;