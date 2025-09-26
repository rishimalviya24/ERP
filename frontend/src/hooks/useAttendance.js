// hooks/useAttendance.js
import { useState } from "react";
import * as attendanceApi from "../api/attendenceApi";

const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch all attendance records
  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getAllAttendance();
      
      // ✅ Fix: Correctly extract data from backend response
      // Backend sends: { success: true, count: X, data: [...] }
      const records = response.data || [];
      const count = response.count || records.length;
      
      setAttendanceRecords(records);
      setTotalCount(count);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance");
      setAttendanceRecords([]); // ✅ Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create attendance record
  const createAttendance = async (attendanceData) => {
    setLoading(true);
    try {
      const response = await attendanceApi.createAttendance(attendanceData);
      const newRecord = response.data || response;
      setAttendanceRecords((prev) => [newRecord, ...prev]);
      setTotalCount((prev) => prev + 1);
      setError(null);
      return newRecord;
    } catch (err) {
      setError(err.message || "Failed to create attendance");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update attendance record
  const updateAttendance = async (id, attendanceData) => {
    setLoading(true);
    try {
      const response = await attendanceApi.updateAttendance(id, attendanceData);
      const updatedRecord = response.data || response;
      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record._id === id ? updatedRecord : record
        )
      );
      setError(null);
      return updatedRecord;
    } catch (err) {
      setError(err.message || "Failed to update attendance");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await attendanceApi.deleteAttendance(id);
      setAttendanceRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
      throw err;
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      await attendanceApi.getAttendanceStats();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    attendanceRecords,
    loading,
    error,
    totalCount,
    fetchAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    fetchAttendanceStats,
  };
};

export default useAttendance;