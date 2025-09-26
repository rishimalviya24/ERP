// pages/dashboards/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCourse } from '../../hooks/useCourse';
import { useBatch } from '../../hooks/useBatch';
import { useStudent } from '../../hooks/useStudent';
import { useProject } from '../../hooks/useProject';
import { useAttendance } from '../../hooks/useAttendance';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { courses, fetchAllCourses } = useCourse();
  const { batches, fetchAllBatches } = useBatch();
  const { students, totalCount: studentCount, fetchAllStudents } = useStudent();
  const { projects, fetchAllProjects } = useProject();
  const { attendanceRecords, fetchAllAttendance } = useAttendance();

  useEffect(() => {
    fetchAllCourses();
    fetchAllBatches();
    fetchAllStudents();
    fetchAllProjects();
    fetchAllAttendance();
  }, []);

  const stats = {
    totalUsers: studentCount || students.length,
    totalCourses: courses.length,
    totalBatches: batches.length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    todayAttendance: attendanceRecords.filter(r => 
      new Date(r.attendance_date).toDateString() === new Date().toDateString()
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Complete system overview and management controls
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UserIcon />}
            color="bg-blue-500"
            link="/students"
          />
          <StatCard
            title="Courses"
            value={stats.totalCourses}
            icon={<BookIcon />}
            color="bg-green-500"
            link="/courses"
          />
          <StatCard
            title="Active Batches"
            value={stats.totalBatches}
            icon={<GroupIcon />}
            color="bg-purple-500"
            link="/batches"
          />
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={<ProjectIcon />}
            color="bg-orange-500"
            link="/projects"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Add User"
              description="Create new user account"
              icon={<UserPlusIcon />}
              link="/students"
              color="bg-blue-100 text-blue-800"
            />
            <QuickActionCard
              title="Create Course"
              description="Add new course"
              icon={<BookPlusIcon />}
              link="/courses"
              color="bg-green-100 text-green-800"
            />
            <QuickActionCard
              title="New Project"
              description="Start new project"
              icon={<ProjectPlusIcon />}
              link="/projects"
              color="bg-purple-100 text-purple-800"
            />
            <QuickActionCard
              title="View Reports"
              description="System analytics"
              icon={<ChartIcon />}
              link="/attendance"
              color="bg-orange-100 text-orange-800"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentList
            title="Recent Users"
            items={students.slice(0, 5)}
            renderItem={(student) => (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {student.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.username}</p>
                  <p className="text-xs text-gray-500">{student.role}</p>
                </div>
              </div>
            )}
            link="/students"
          />
          <RecentList
            title="Recent Projects"
            items={projects.slice(0, 5)}
            renderItem={(project) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.status}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.priority}
                </span>
              </div>
            )}
            link="/projects"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;