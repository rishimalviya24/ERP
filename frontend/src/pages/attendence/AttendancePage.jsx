// pages/AttendancePage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useAttendance from "../../hooks/useAttendance";
import { useBatch } from "../../hooks/useBatch";
import { useProject } from "../../hooks/useProject";

// ✅ Corrected imports
import AttendanceCard from "../../components/Attendence/AttendanceCard";
import AttendanceForm from "../../components/Attendence/AttendenceForm";
import BulkAttendanceModal from "../../components/Attendence/AttendenceForm";
import Modal from "../../components/Enrollment/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { NoDataFound, NoSearchResults } from "../../components/EmptyState";

const AttendancePage = () => {
  const {
    attendanceRecords,
    loading,
    error,
    totalCount,
    fetchAllAttendance,
    deleteAttendance,
    fetchAttendanceStats,
  } = useAttendance();
  const { batches, fetchAllBatches } = useBatch();
  const { fetchAllProjects } = useProject();
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  useEffect(() => {
    fetchAllAttendance();
    fetchAllBatches();
    fetchAllProjects();
    fetchAttendanceStats();
  }, []);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await deleteAttendance(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleCloseBulkModal = () => {
    setShowBulkModal(false);
  };

  // 🔍 Filtering logic
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.batch?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(record.attendance_date).toDateString() ===
        new Date(dateFilter).toDateString();

    const matchesBatch = batchFilter === "all" || record.batch?._id === batchFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesBatch;
  });

  const canManageAttendance = user && ["admin", "instructor"].includes(user.role);

  // 📊 Quick Stats
  const todayRecords = attendanceRecords.filter(
    (record) =>
      new Date(record.attendance_date).toDateString() === new Date().toDateString()
  );

  const quickStats = {
    total: totalCount || attendanceRecords.length,
    present: todayRecords.filter((r) => r.status === "present").length,
    absent: todayRecords.filter((r) => r.status === "absent").length,
    late: todayRecords.filter((r) => r.status === "late").length,
  };

  if (loading && attendanceRecords.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
              <p className="mt-2 text-sm text-gray-600">
                Track student and employee attendance across batches and projects
              </p>
            </div>
            {canManageAttendance && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Bulk Attendance
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Mark Attendance
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Records", value: quickStats.total, color: "blue" },
            { label: "Present Today", value: quickStats.present, color: "green" },
            { label: "Absent Today", value: quickStats.absent, color: "red" },
            { label: "Late Today", value: quickStats.late, color: "yellow" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Batches</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateFilter("");
              setBatchFilter("all");
            }}
            className="px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Attendance Records */}
        {filteredRecords.length === 0 ? (
          searchTerm || statusFilter !== "all" || dateFilter || batchFilter !== "all" ? (
            <NoSearchResults
              searchTerm={searchTerm}
              onClearSearch={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
                setBatchFilter("all");
              }}
            />
          ) : (
            <NoDataFound
              entityName="attendance records"
              action={
                canManageAttendance
                  ? { label: "Mark Attendance", onClick: () => setShowModal(true) }
                  : null
              }
            />
          )
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <AttendanceCard
                key={record._id}
                record={record}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canManageAttendance}
                canDelete={user && user.role === "admin"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <AttendanceForm
            record={editingRecord}
            onClose={handleCloseModal}
            onSuccess={fetchAllAttendance}
          />
        </Modal>
      )}

      {showBulkModal && (
        <Modal onClose={handleCloseBulkModal}>
          <BulkAttendanceModal
            onClose={handleCloseBulkModal}
            onSuccess={fetchAllAttendance}
          />
        </Modal>
      )}
    </div>
  );
};

export default AttendancePage;
