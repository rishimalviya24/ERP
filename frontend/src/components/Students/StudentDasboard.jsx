// // components/StudentDashboard.jsx - Student ke liye
// import React, { useState, useEffect } from 'react';
// import  getMyProfile  from '../../api/studentApi';
// import { getMyBatches } from '../../../../backend/src/controller/student.controller';


// const StudentDashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [profileRes, batchesRes] = await Promise.all([
//           getMyProfile(),
//           getMyBatches()
//         ]);
        
//         setProfile(profileRes.data.data);
//         setBatches(batchesRes.data.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      
//       {/* Student Profile */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">My Profile</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="font-medium">Name:</label>
//             <p>{profile?.username}</p>
//           </div>
//           <div>
//             <label className="font-medium">Email:</label>
//             <p>{profile?.email}</p>
//           </div>
//           <div>
//             <label className="font-medium">Phone:</label>
//             <p>{profile?.phone || 'Not provided'}</p>
//           </div>
//           <div>
//             <label className="font-medium">Status:</label>
//             <p className={profile?.status === 'active' ? 'text-green-600' : 'text-red-600'}>
//               {profile?.status}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Enrolled Batches */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-4">My Enrolled Batches</h2>
//         {batches.length === 0 ? (
//           <p className="text-gray-500">No batches enrolled yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {batches.map((enrollment) => (
//               <div key={enrollment.enrollmentId} className="border rounded-lg p-4">
//                 <h3 className="font-semibold">{enrollment.batch.name}</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {enrollment.batch.description}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Start Date:</strong> {new Date(enrollment.batch.startDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm">
//                   <strong>End Date:</strong> {new Date(enrollment.batch.endDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Enrolled:</strong> {new Date(enrollment.enrolledDate).toLocaleDateString()}
//                 </p>
//                 <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
//                   enrollment.batch.status === 'active' 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {enrollment.batch.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;