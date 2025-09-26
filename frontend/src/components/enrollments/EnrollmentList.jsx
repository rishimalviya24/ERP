// pages/enrollments/EnrollmentList.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useEnrollment } from "../../hooks/useEnrollment";
import { useCourse } from "../../hooks/useCourse";
import { useBatch } from "../../hooks/useBatch";

const EnrollmentList = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    enrollments = [],
    myEnrollments = [],
    loading,
    error,
    fetchAllEnrollments,
    fetchMyEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    clearEnrollmentError,
  } = useEnrollment();

  const { courses = [], fetchAllCourses } = useCourse();
  const { batches = [], fetchAllBatches } = useBatch();

  const [showModal, setShowModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [formData, setFormData] = useState({
    course: "",
    batch: "",
    status: "enrolled",
  });

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAllEnrollments();
    } else if (user?.role === "student") {
      fetchMyEnrollments();
    }
    fetchAllCourses();
    fetchAllBatches();
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearEnrollmentError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearEnrollmentError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment._id, formData);
      } else {
        await createEnrollment(formData);
      }
      setShowModal(false);
      setEditingEnrollment(null);
      setFormData({ course: "", batch: "", status: "enrolled" });
    } catch (error) {
      console.error("Failed to save enrollment:", error);
    }
  };

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setFormData({
      course: enrollment.course?._id || "",
      batch: enrollment.batch?._id || "",
      status: enrollment.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      await deleteEnrollment(id);
    }
  };

  // Ensure displayEnrollments is always an array
  const displayEnrollments = Array.isArray(
    user?.role === "admin" ? enrollments : myEnrollments
  )
    ? user?.role === "admin"
      ? enrollments
      : myEnrollments
    : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user?.role === "student" ? "My Enrollments" : "All Enrollments"}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user?.role === "student"
              ? "View and manage your course enrollments"
              : "Manage all student enrollments"}
          </p>
        </div>
        {user?.role === "student" && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              New Enrollment
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        /* Enrollment Table */
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {displayEnrollments.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {user?.role === "admin" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Student
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Enrolled Date
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayEnrollments.map((enrollment) => (
                        <tr key={enrollment._id}>
                          {user?.role === "admin" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {enrollment.student?.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {enrollment.student?.email}
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.course?.title || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {enrollment.batch?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                enrollment.status === "enrolled"
                                  ? "bg-green-100 text-green-800"
                                  : enrollment.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.enrolledAt
                              ? new Date(
                                  enrollment.enrolledAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {(user?.role === "admin" ||
                              user?.role === "instructor") && (
                              <button
                                onClick={() => handleEdit(enrollment)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                            )}
                            {(user?.role === "admin" ||
                              user?._id === enrollment.student?._id) && (
                              <button
                                onClick={() => handleDelete(enrollment._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No enrollments found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                {editingEnrollment ? "Edit Enrollment" : "New Enrollment"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Course
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {Array.isArray(courses) &&
                      courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Batch (Optional)
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Batch</option>
                    {Array.isArray(batches) &&
                      batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                  </select>
                </div>

                {editingEnrollment &&
                  (user?.role === "admin" || user?.role === "instructor") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="enrolled">Enrolled</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>
                  )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEnrollment(null);
                      setFormData({
                        course: "",
                        batch: "",
                        status: "enrolled",
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingEnrollment ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;
