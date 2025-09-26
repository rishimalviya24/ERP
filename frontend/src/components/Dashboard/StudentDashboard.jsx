// pages/dashboards/StudentDashboard.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAttendance } from "../../hooks/useAttendance";
import { useCourse } from "../../hooks/useCourse";

// Import your UI components
import StatCard from "../../components/StatCard";
import { GroupIcon, CheckIcon, StarIcon } from "../../components/Icons";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { fetchUserAttendance, userAttendance } = useAttendance();
  const { fetchAllCourses } = useCourse();

  useEffect(() => {
    if (user) {
      fetchUserAttendance(user._id);
      fetchAllCourses();
    }
  }, [user, fetchUserAttendance, fetchAllCourses]);

  const myAttendance = userAttendance[user?._id] || [];
  const myBatches = user?.batches || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your learning progress and attendance</p>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Enrolled Batches" value={myBatches.length} icon={<GroupIcon />} color="bg-blue-500" />
          <StatCard title="Attendance Records" value={myAttendance.length} icon={<CheckIcon />} color="bg-green-500" />
          <StatCard
            title="Present Days"
            value={myAttendance.filter((a) => a.status === "present").length}
            icon={<StarIcon />}
            color="bg-purple-500"
          />
        </div>

        {/* My Batches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Batches</h2>
          {myBatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBatches.map((batch) => (
                <div key={batch._id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-600">{batch.course?.title}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No batches enrolled yet.</p>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance</h2>
          {myAttendance.length > 0 ? (
            <div className="space-y-3">
              {myAttendance.slice(0, 5).map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        record.status === "present"
                          ? "bg-green-400"
                          : record.status === "late"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    ></span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.attendance_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{record.batch?.name}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : record.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
