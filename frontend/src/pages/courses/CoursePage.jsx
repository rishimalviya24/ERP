// // pages/CoursePage.jsx
// import React, { useState, useEffect } from 'react';
// import { useCourse } from '../../hooks/useCourse';
// import { useSelector } from 'react-redux';
// import CourseCard from '../../components/CourseCard';
// import CourseForm from '../../components/Courses/CourseForm';
// import Modal from '../../components/Enrollment/Modal';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import EmptyState from '../../components/EmptyState';

// const CoursePage = () => {
//   const { courses, loading, error, fetchAllCourses, deleteCourse } = useCourse();
//   const { user } = useSelector(state => state.auth);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterBy, setFilterBy] = useState('all');

//   useEffect(() => {
//     if (courses.length === 0) {
//       fetchAllCourses();
//     }
//   }, [courses.length, fetchAllCourses]);

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       try {
//         await deleteCourse(id);
//       } catch (error) {
//         console.error('Delete failed:', error);
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingCourse(null);
//   };

//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           course.description.toLowerCase().includes(searchTerm.toLowerCase());

//     if (filterBy === 'my-courses' && user) {
//       return matchesSearch && course.instructor._id === user._id;
//     }

//     return matchesSearch;
//   });

//   const canCreateCourse = user && ['admin', 'instructor'].includes(user.role);

//   if (loading && courses.length === 0) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-6 flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
//               <p className="mt-2 text-sm text-gray-600">Manage and explore available courses</p>
//             </div>
//             {canCreateCourse && (
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Course
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Filter */}
//           {user && ['admin', 'instructor'].includes(user.role) && (
//             <div>
//               <select
//                 value={filterBy}
//                 onChange={(e) => setFilterBy(e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="all">All Courses</option>
//                 <option value="my-courses">My Courses</option>
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Course Grid */}
//         {filteredCourses.length === 0 ? (
//           <EmptyState 
//             title="No courses found"
//             description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first course"}
//             action={canCreateCourse && !searchTerm ? { label: "Create Course", onClick: () => setShowModal(true) } : null}
//           />
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.map(course => (
//               <CourseCard
//                 key={course._id}
//                 course={course}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 canEdit={user && (user.role === 'admin' || course.instructor._id === user._id)}
//                 canDelete={user && user.role === 'admin'}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <Modal onClose={handleCloseModal}>
//           <CourseForm
//             course={editingCourse}
//             onClose={handleCloseModal}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CoursePage;
// pages/CoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useCourse } from '../../hooks/useCourse';
import { useSelector } from 'react-redux';
import CourseCard from '../../components/CourseCard';
import CourseForm from '../../components/Courses/CourseForm';
import Modal from '../../components/Enrollment/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const CoursePage = () => {
  const { courses, loading, error, fetchAllCourses, deleteCourse } = useCourse();
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    if (courses.length === 0) {
      fetchAllCourses();
    }
  }, [courses.length, fetchAllCourses]);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === 'my-courses' && user) {
      return matchesSearch && course.instructor?._id === user._id;
    }

    return matchesSearch;
  });

  const canCreateCourse = user && ['admin', 'instructor'].includes(user.role);

  if (loading && courses.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="mt-2 text-sm text-gray-600">Manage and explore available courses</p>
            </div>
            {canCreateCourse && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filter */}
          {user && ['admin', 'instructor'].includes(user.role) && (
            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Courses</option>
                <option value="my-courses">My Courses</option>
              </select>
            </div>
          )}
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

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <EmptyState 
            title="No courses found"
            description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first course"}
            action={canCreateCourse && !searchTerm ? { label: "Create Course", onClick: () => setShowModal(true) } : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                // Optional chaining ensures no crash for students
                canEdit={user && (user.role === 'admin' || course.instructor?._id === user._id)}
                canDelete={user && user.role === 'admin'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <CourseForm
            course={editingCourse}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CoursePage;
