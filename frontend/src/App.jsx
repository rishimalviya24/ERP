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

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import CoursePage from "./pages/courses/CoursePage";
import BatchPage from "./pages/Batches/BatchPage";
import StudentPage from "./pages/students/StudentPage";
import ProjectPage from "./pages/project/ProjectPage";


// Inventory pages
import InventoryItemPage from "./pages/Inventory/InventoryPage";
import InventoryTransactionPage from "./pages/Inventory/InventoryTransactionsPage";
import PaymentPage from "./pages/payments/PaymentsPage.jsx";
import PaymentHistory from "./components/payments/PaymentHistory.jsx";
import PaymentModal from "./components/payments/PaymentModal.jsx";

// ✅ NEW Finance pages
import InvoicePage from "./pages/invoices/InvoicePage";
import LedgerPage from "./pages/ledger/LedgerPage";
import AttendancePage from "./pages/attendence/AttendancePage";
import StudentEnrollmentModal from "./pages/enrollments/StudentEnrollmentModal";
import StudentProfile from "./pages/students/StudentProfile";
import EnrollmentList from "./components/enrollments/EnrollmentList";

// ✅ Import Razorpay React Component
import RazorpayPayment from "./components/RazorpayPayment";
import PaymentPageWrapper from "./pages/payments/PaymentPageWrapper.jsx";
import InvoicesPage from "./pages/invoices/InvoicesPage.jsx";
// import StudentDashboard from "./components/Students/StudentDasboard.jsx";

// Protected Route Component
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

// Public Route Component (redirect if already logged in)
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
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
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

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <ProjectPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Inventory Items */}
          <Route
            path="/inventory/items"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <InventoryItemPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Inventory Transactions */}
          <Route
            path="/inventory/transactions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout>
                  <InventoryTransactionPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: Invoices */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={["admin", "accountant"]}>
                <DashboardLayout>
                  <InvoicePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Payments Page (existing) */}
          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["admin", "accountant"]}>
                <DashboardLayout>
                  <PaymentHistory />
                  <PaymentPageWrapper />
                  
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Razorpay Integration Route */}
          <Route
            path="/payments/razorpay"
            element={
              <ProtectedRoute allowedRoles={["admin", "accountant", "student"]}>
                <DashboardLayout>
                  <RazorpayPayment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: Ledger */}
          <Route
            path="/ledger"
            element={
              <ProtectedRoute allowedRoles={["admin", "accountant"]}>
                <DashboardLayout>
                  <LedgerPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Enrollments */}
          <Route
            path="/enrollments"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <EnrollmentList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <DashboardLayout>
                  <AttendancePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Students (list + profile) */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentPage />
                  {/* <StudentDashboard/> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all route */}
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
