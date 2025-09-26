// components/Students/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStudentById } from '../../api/studentApi';

const StudentProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getStudentById(user._id);
        setStudent(data);
      } catch (err) {
        setError('Failed to load student details');
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [user]);

  if (loading) return <div className="p-6">Loading student details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!student) return <div className="p-6">No student found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* Basic Info */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Name:</strong> {student.name}</div>
        <div><strong>Email:</strong> {student.email}</div>
        <div><strong>Phone:</strong> {student.phone}</div>
        <div><strong>Enrollment No:</strong> {student.enrollmentNumber}</div>
      </div>

      {/* Courses */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
        {student.courses?.length > 0 ? (
          <ul className="list-disc list-inside">
            {student.courses.map(c => (
              <li key={c._id}>{c.title}</li>
            ))}
          </ul>
        ) : (
          <p>No courses enrolled</p>
        )}
      </div>

      {/* Batches */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Batches</h3>
        {student.batches?.length > 0 ? (
          <ul className="list-disc list-inside">
            {student.batches.map(b => (
              <li key={b._id}>{b.name}</li>
            ))}
          </ul>
        ) : (
          <p>No batches assigned</p>
        )}
      </div>

      {/* Attendance */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Attendance</h3>
        {student.attendance?.length > 0 ? (
          <ul className="list-disc list-inside">
            {student.attendance.map(a => (
              <li key={a._id}>{a.date}: {a.status}</li>
            ))}
          </ul>
        ) : (
          <p>No attendance records</p>
        )}
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Projects</h3>
        {student.projects?.length > 0 ? (
          <ul className="list-disc list-inside">
            {student.projects.map(p => (
              <li key={p._id}>{p.title}</li>
            ))}
          </ul>
        ) : (
          <p>No projects assigned</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
