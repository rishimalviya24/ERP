// components/StudentCard.jsx
import React from 'react';

const StudentCard = ({ 
  student, 
  onEdit, 
  onDelete, 
  onEnroll, 
  canEdit, 
  canDelete, 
  canEnroll 
}) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' };
      case 'instructor':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Instructor' };
      case 'accountant':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Accountant' };
      case 'employee':
        return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Employee' };
      case 'student':
        return { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Student' };
      case 'user':
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'User' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active', dot: 'bg-green-400' };
      case 'inactive':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive', dot: 'bg-red-400' };
      default:
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active', dot: 'bg-green-400' };
    }
  };

  const roleConfig = getRoleConfig(student.role);
  const statusConfig = getStatusConfig(student.status);
  const enrolledBatches = student.batches || [];
  const isEnrolled = enrolledBatches.length > 0;

  // Generate initials for avatar
  const getInitials = (username, email) => {
    if (username) {
      const names = username.split(' ');
      if (names.length >= 2) {
        return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
      }
      return username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(student.username, student.email);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Avatar */}
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">
                {initials}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {student.username || 'Unknown User'}
                </h3>
                <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {student.email || 'No email provided'}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
                  {roleConfig.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Menu */}
          {(canEdit || canDelete || canEnroll) && (
            <div className="flex items-center space-x-1 ml-2">
              {canEnroll && (
                <button
                  onClick={() => onEnroll(student)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  title="Manage enrollments"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </button>
              )}
              
              {canEdit && (
                <button
                  onClick={() => onEdit(student)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  title="Edit student"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={() => onDelete(student._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete student"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Student Details */}
      <div className="px-6 pb-4 space-y-3">
        {/* Personal Information */}
        {(student.phone || student.dateOfBirth) && (
          <div className="space-y-2">
            {student.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{student.phone}</span>
              </div>
            )}
            
            {student.dateOfBirth && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Born: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Enrollment Status */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Enrollment Status</span>
            {isEnrolled ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Enrolled
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Not Enrolled
              </span>
            )}
          </div>

          {/* Enrolled Batches */}
          {isEnrolled ? (
            <div>
              <div className="space-y-1">
                {enrolledBatches.slice(0, 2).map((batch, index) => (
                  <div key={batch._id || index} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                      <span className="text-gray-700 font-medium truncate">
                        {batch.name || 'Unnamed Batch'}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {batch.students?.length || 0} students
                    </span>
                  </div>
                ))}
                {enrolledBatches.length > 2 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{enrolledBatches.length - 2} more batch{enrolledBatches.length - 2 !== 1 ? 'es' : ''}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="text-gray-400 mb-1">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">No batches assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Member since {new Date(student.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex items-center space-x-2">
            {isEnrolled && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {enrolledBatches.length} batch{enrolledBatches.length !== 1 ? 'es' : ''}
              </span>
            )}
            
            <div className="flex items-center text-xs text-gray-500">
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} mr-1`}></div>
              {statusConfig.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;