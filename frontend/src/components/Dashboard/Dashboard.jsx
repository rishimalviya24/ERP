// // pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useCourse } from '../../hooks/useCourse';
// import { useBatch } from '../../hooks/useBatch';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   const { user } = useSelector(state => state.auth);
//   const { courses, fetchAllCourses } = useCourse();
//   const { batches, fetchAllBatches } = useBatch();
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     totalBatches: 0,
//     activeBatches: 0,
//     myCourses: 0,
//     myBatches: 0
//   });

//   useEffect(() => {
//     fetchAllCourses();
//     fetchAllBatches();
//   }, [fetchAllBatches,fetchAllCourses]);

//   useEffect(() => {
//     const now = new Date();
//     const activeBatches = batches.filter(batch => {
//       const startDate = new Date(batch.startDate);
//       const endDate = new Date(batch.endDate);
//       return now >= startDate && now <= endDate;
//     });

//     const myCourses = courses.filter(course => course.instructor?._id === user?._id);
//     const myBatches = batches.filter(batch => batch.instructor?._id === user?._id);

//     setStats({
//       totalCourses: courses.length,
//       totalBatches: batches.length,
//       activeBatches: activeBatches.length,
//       myCourses: myCourses.length,
//       myBatches: myBatches.length
//     });
//   }, [courses, batches, user]);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 17) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   const recentCourses = courses.slice(0, 5);
//   const recentBatches = batches.slice(0, 5);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             {getGreeting()}, {user?.username}!
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Welcome to your ERP dashboard. Here's what's happening today.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title="Total Courses"
//             value={stats.totalCourses}
//             icon={
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             }
//             color="bg-blue-500"
//             link="/courses"
//           />

//           <StatCard
//             title="Total Batches"
//             value={stats.totalBatches}
//             icon={
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             }
//             color="bg-green-500"
//             link="/batches"
//           />

//           <StatCard
//             title="Active Batches"
//             value={stats.activeBatches}
//             icon={
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             }
//             color="bg-yellow-500"
//             link="/batches"
//           />

//           {(user?.role === 'admin' || user?.role === 'instructor') && (
//             <StatCard
//               title={user?.role === 'admin' ? 'Total Students' : 'My Students'}
//               value={user?.role === 'admin' ? '156' : '42'}
//               icon={
//                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                 </svg>
//               }
//               color="bg-purple-500"
//               link="/students"
//             />
//           )}
//         </div>

//         {/* Quick Actions */}
//         {(user?.role === 'admin' || user?.role === 'instructor') && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Link
//                 to="/courses"
//                 className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
//               >
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-blue-900">Create Course</p>
//                   <p className="text-sm text-blue-700">Add a new course to the system</p>
//                 </div>
//               </Link>

//               <Link
//                 to="/batches"
//                 className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200"
//               >
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
//                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-green-900">Create Batch</p>
//                   <p className="text-sm text-green-700">Start a new batch for students</p>
//                 </div>
//               </Link>

//               <Link
//                 to="/attendance"
//                 className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-200"
//               >
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
//                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-purple-900">Take Attendance</p>
//                   <p className="text-sm text-purple-700">Mark student attendance</p>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Recent Courses */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-medium text-gray-900">Recent Courses</h3>
//                 <Link
//                   to="/courses"
//                   className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
//                 >
//                   View all
//                 </Link>
//               </div>
//             </div>
//             <div className="divide-y divide-gray-200">
//               {recentCourses.length > 0 ? (
//                 recentCourses.map((course) => (
//                   <div key={course._id} className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{course.title}</p>
//                         <p className="text-sm text-gray-500">
//                           {course.duration} hours • {course.instructor?.username}
//                         </p>
//                       </div>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         Active
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-6 py-8 text-center">
//                   <p className="text-gray-500">No courses found</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Recent Batches */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-medium text-gray-900">Recent Batches</h3>
//                 <Link
//                   to="/batches"
//                   className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
//                 >
//                   View all
//                 </Link>
//               </div>
//             </div>
//             <div className="divide-y divide-gray-200">
//               {recentBatches.length > 0 ? (
//                 recentBatches.map((batch) => {
//                   const now = new Date();
//                   const startDate = new Date(batch.startDate);
//                   const endDate = new Date(batch.endDate);
//                   let status = 'upcoming';
//                   let statusColor = 'bg-blue-100 text-blue-800';
                  
//                   if (now >= startDate && now <= endDate) {
//                     status = 'active';
//                     statusColor = 'bg-green-100 text-green-800';
//                   } else if (now > endDate) {
//                     status = 'completed';
//                     statusColor = 'bg-gray-100 text-gray-800';
//                   }

//                   return (
//                     <div key={batch._id} className="px-6 py-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{batch.name}</p>
//                           <p className="text-sm text-gray-500">
//                             {batch.course?.title} • {batch.students?.length || 0} students
//                           </p>
//                         </div>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="px-6 py-8 text-center">
//                   <p className="text-gray-500">No batches found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Stat Card Component
// const StatCard = ({ title, value, icon, color, link }) => {
//   const CardContent = () => (
//     <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
//       <div className="p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
//               {icon}
//             </div>
//           </div>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-600">{title}</p>
//             <p className="text-3xl font-bold text-gray-900">{value}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return link ? (
//     <Link to={link}>
//       <CardContent />
//     </Link>
//   ) : (
//     <CardContent />
//   );
// };

// export default Dashboard;
// pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCourse } from '../../hooks/useCourse';
import { useBatch } from '../../hooks/useBatch';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { courses, fetchAllCourses, loading: coursesLoading } = useCourse();
  const { batches, fetchAllBatches, loading: batchesLoading } = useBatch();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalBatches: 0,
    activeBatches: 0,
    myCourses: 0,
    myBatches: 0,
  });

  useEffect(() => {
    fetchAllCourses();
    fetchAllBatches();
  }, [fetchAllCourses, fetchAllBatches]);

  useEffect(() => {
    const now = new Date();

    const activeBatches = batches.filter(batch => {
      const startDate = new Date(batch.startDate);
      const endDate = new Date(batch.endDate);
      return now >= startDate && now <= endDate;
    });

    const myCourses = courses.filter(course => course.instructor?._id === user?._id);
    const myBatches = batches.filter(batch => batch.instructor?._id === user?._id);

    setStats({
      totalCourses: courses.length,
      totalBatches: batches.length,
      activeBatches: activeBatches.length,
      myCourses: myCourses.length,
      myBatches: myBatches.length,
    });
  }, [courses, batches, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const recentCourses = courses.slice(0, 5);
  const recentBatches = batches.slice(0, 5);

  if (coursesLoading || batchesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to your ERP dashboard. Here's an overview of your system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="bg-blue-500"
            link="/courses"
          />

          <StatCard
            title="Total Batches"
            value={stats.totalBatches}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="bg-green-500"
            link="/batches"
          />

          <StatCard
            title="Active Batches"
            value={stats.activeBatches}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="bg-yellow-500"
            link="/batches"
          />

          {(user?.role === 'admin' || user?.role === 'instructor') && (
            <StatCard
              title={user?.role === 'admin' ? 'Total Students' : 'My Students'}
              value={user?.role === 'admin' ? '156' : '42'}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="bg-purple-500"
              link="/students"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <RecentCard title="Recent Courses" items={recentCourses} link="/courses" type="course" />

          {/* Recent Batches */}
          <RecentCard title="Recent Batches" items={recentBatches} link="/batches" type="batch" />
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, link }) => {
  const CardContent = () => (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}><CardContent /></Link> : <CardContent />;
};

// RecentCard Component
const RecentCard = ({ title, items, link, type }) => {
  const now = new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <Link to={link} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
          View all
        </Link>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => {
            if (type === 'course') {
              return (
                <div key={item._id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.duration} hours • {item.instructor?.username}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              );
            } else if (type === 'batch') {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              let status = 'upcoming';
              let statusColor = 'bg-blue-100 text-blue-800';

              if (now >= startDate && now <= endDate) {
                status = 'active';
                statusColor = 'bg-green-100 text-green-800';
              } else if (now > endDate) {
                status = 'completed';
                statusColor = 'bg-gray-100 text-gray-800';
              }

              return (
                <div key={item._id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.course?.title} • {item.students?.length || 0} students</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">No items found</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
