// pages/dashboards/InstructorDashboard.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCourse } from "../../hooks/useCourse";
import { useBatch } from "../../hooks/useBatch";
import { useProject } from "../../hooks/useProject";
import { Link } from "react-router-dom";

// Import your UI components
import StatCard from "../../components/StatCard";
import RecentList from "../../components/RecentList";
import { BookIcon, GroupIcon, ProjectIcon, UserIcon } from "../../components/Icons";

const InstructorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { courses, fetchAllCourses } = useCourse();
  const { batches, fetchAllBatches } = useBatch();
  const { projects, fetchAllProjects } = useProject();

  useEffect(() => {
    fetchAllCourses();
    fetchAllBatches();
    fetchAllProjects();
  }, [fetchAllCourses, fetchAllBatches, fetchAllProjects]);

  const myCourses = courses.filter((course) => course.instructor?._id === user?._id);
  const myBatches = batches.filter((batch) => batch.instructor?._id === user?._id);
  const myProjects = projects.filter((project) => project.manager?._id === user?._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your courses, batches, and track student progress</p>
        </div>

        {/* Instructor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="My Courses" value={myCourses.length} icon={<BookIcon />} color="bg-blue-500" />
          <StatCard title="My Batches" value={myBatches.length} icon={<GroupIcon />} color="bg-green-500" />
          <StatCard title="My Projects" value={myProjects.length} icon={<ProjectIcon />} color="bg-purple-500" />
          <StatCard
            title="Total Students"
            value={myBatches.reduce((acc, batch) => acc + (batch.students?.length || 0), 0)}
            icon={<UserIcon />}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentList
            title="My Recent Courses"
            items={myCourses.slice(0, 5)}
            renderItem={(course) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.duration} hours</p>
                </div>
              </div>
            )}
            link="/courses"
          />
          <RecentList
            title="My Active Batches"
            items={myBatches.slice(0, 5)}
            renderItem={(batch) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                  <p className="text-xs text-gray-500">{batch.students?.length || 0} students</p>
                </div>
                <Link
                  to="/attendance"
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
                >
                  Take Attendance
                </Link>
              </div>
            )}
            link="/batches"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
