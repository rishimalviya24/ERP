// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Layout
import DashboardLayout from "./components/Layout/DashboardLayout";

// Public Pages
import Home from "./pages/auth/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import ForgotPasswordPage from "./pages/auth/FogotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./components/Dashboard/Dashboard";
import CoursePage from "./pages/courses/CoursePage";
import BatchPage from "./pages/Batches/BatchPage";
import CourseForm from "./components/Courses/CourseForm";

// ✅ Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ✅ Public Route Component
const PublicRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CoursePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/batches"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <BatchPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Example nested course routes */}
          <Route
            path="/courses/list"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CoursePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <CourseForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for future pages */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Students Page
                    </h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Attendance Page
                    </h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <Link
                    to="/dashboard"
                    className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
