// // components/BatchCard.jsx
// import React from 'react';

// const BatchCard = ({ batch, onEdit, onDelete, canEdit, canDelete, status }) => {
//   const getStatusConfig = (status) => {
//     switch (status) {
//       case 'upcoming':
//         return {
//           bg: 'bg-blue-100',
//           text: 'text-blue-800',
//           label: 'Upcoming'
//         };
//       case 'active':
//         return {
//           bg: 'bg-green-100',
//           text: 'text-green-800',
//           label: 'Active'
//         };
//       case 'completed':
//         return {
//           bg: 'bg-gray-100',
//           text: 'text-gray-800',
//           label: 'Completed'
//         };
//       default:
//         return {
//           bg: 'bg-gray-100',
//           text: 'text-gray-800',
//           label: 'Unknown'
//         };
//     }
//   };

//   const statusConfig = getStatusConfig(status);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
//       {/* Header */}
//       <div className="p-6 pb-4">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               {batch.name}
//             </h3>
//             <div className="flex items-center text-sm text-gray-600 mb-3">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//               <span>{batch.course?.title || 'No course assigned'}</span>
//             </div>
//           </div>
          
//           {/* Action Menu */}
//           {(canEdit || canDelete) && (
//             <div className="flex items-center space-x-1 ml-4">
//               {canEdit && (
//                 <button
//                   onClick={() => onEdit(batch)}
//                   className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
//                   title="Edit batch"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                 </button>
//               )}
              
//               {canDelete && (
//                 <button
//                   onClick={() => onDelete(batch._id)}
//                   className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
//                   title="Delete batch"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Batch Details */}
//       <div className="px-6 pb-4 space-y-3">
//         {/* Date Range */}
//         <div className="flex items-center text-sm text-gray-500">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//           <span>{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</span>
//         </div>

//         {/* Instructor */}
//         <div className="flex items-center text-sm text-gray-500">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           <span>Instructor: {batch.instructor?.username || 'Unknown'}</span>
//         </div>

//         {/* Students Count */}
//         <div className="flex items-center text-sm text-gray-500">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//           </svg>
//           <span>{batch.students?.length || 0} students enrolled</span>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-500">
//             Created {new Date(batch.createdAt).toLocaleDateString()}
//           </span>
          
//           <div className="flex items-center">
//             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
//               {statusConfig.label}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchCard;
// components/BatchCard.jsx
import React from "react";

const BatchCard = ({ batch, onEdit, onDelete, canEdit, canDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "upcoming":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          label: "Upcoming",
        };
      case "active":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Active",
        };
      case "completed":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "Completed",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "Unknown",
        };
    }
  };

  // ✅ Now we directly use batch.status instead of external `status` prop
  const statusConfig = getStatusConfig(batch.status);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {batch.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>{batch.course?.title || "No course assigned"}</span>
            </div>
          </div>

          {/* Action Menu */}
          {(canEdit || canDelete) && (
            <div className="flex items-center space-x-1 ml-4">
              {canEdit && (
                <button
                  onClick={() => onEdit(batch)} // ✅ Fixed edit button
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                  title="Edit batch"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => onDelete(batch._id)} // ✅ Fixed delete button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  title="Delete batch"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Batch Details */}
      <div className="px-6 pb-4 space-y-3">
        {/* Date Range */}
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Instructor: {batch.instructor?.username || "Unknown"}</span>
        </div>

        {/* Students Count */}
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <span>{batch.students?.length || 0} students enrolled</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created {new Date(batch.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
