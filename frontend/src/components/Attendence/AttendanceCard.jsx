// components/AttendanceCard.jsx
import React from 'react';

const AttendanceCard = ({ record, onEdit, onDelete, canEdit, canDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'present':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Present', icon: '✓' };
      case 'absent':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Absent', icon: '✗' };
      case 'late':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Late', icon: '⏰' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown', icon: '?' };
    }
  };

  const statusConfig = getStatusConfig(record.status);
  const attendanceDate = new Date(record.attendance_date);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* User Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {record.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {record.user?.name || record.user?.username || 'Unknown User'}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  <span className="mr-1">{statusConfig.icon}</span>
                  {statusConfig.label}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {record.user?.email || 'No email provided'}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{attendanceDate.toLocaleDateString()}</span>
                </div>

                {record.batch && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{record.batch.name}</span>
                  </div>
                )}

                {record.project && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{record.project.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(canEdit || canDelete) && (
            <div className="flex items-center space-x-1 ml-4">
              {canEdit && (
                <button
                  onClick={() => onEdit(record)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  title="Edit attendance"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={() => onDelete(record._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete attendance"
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
    </div>
  );
};

export default AttendanceCard