import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from 'react';

import ProtectedRoute from "./components/ProtectedRoute";

// Lazy Loaded Pages
const Login = React.lazy(() => import("./pages/Login"));
const AdminLogin = React.lazy(() => import("./pages/admin/Admin-Login"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));

// Lazy Loaded Admin Dashboard Pages
const AdminLayout = React.lazy(() => import("./pages/admin/AdminDashboard/AdminLayout").then(m => ({ default: m.AdminLayout })));
const DashboardHome = React.lazy(() => import("./pages/admin/AdminDashboard/DashboardHome").then(m => ({ default: m.DashboardHome })));
const AddCourse = React.lazy(() => import("./pages/admin/AdminDashboard/AddCourse").then(m => ({ default: m.AddCourse })));
const ManageCourse = React.lazy(() => import("./pages/admin/AdminDashboard/ManageCourse").then(m => ({ default: m.ManageCourse })));
const UpdateAdminProfile = React.lazy(() => import("./pages/admin/AdminDashboard/UpdateAdminProfile"));
const AddSubject = React.lazy(() => import("./pages/admin/AdminDashboard/AddSubject"));
const ManageSubjects = React.lazy(() => import("./pages/admin/AdminDashboard/ManageSubject"));
const NotifyStudent = React.lazy(() => import("./pages/admin/AdminDashboard/NotifyStudent").then(m => ({ default: m.NotifyStudent })));
const NotifyFaculty = React.lazy(() => import("./pages/admin/AdminDashboard/NotifyFaculty"));
const Fees = React.lazy(() => import("./pages/admin/AdminDashboard/Fees"));
const ManageFaculty = React.lazy(() => import("./pages/admin/AdminDashboard/ManageFaculty"));
const ManageStudent = React.lazy(() => import("./pages/admin/AdminDashboard/ManageStudent"));
const AddStudent = React.lazy(() => import("./pages/admin/AdminDashboard/AddStudent"));
const AddFaculty = React.lazy(() => import("./pages/admin/AdminDashboard/AddFaculty"));
const Attendance = React.lazy(() => import("./pages/admin/AdminDashboard/Attendance"));
const Marks = React.lazy(() => import("./pages/admin/AdminDashboard/Marks"));

// Loader Component
const LoadingSpinner = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-500 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/AdminControl" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/Admin-Dashboard" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="AdminProfile" element={<UpdateAdminProfile />} />
              <Route path="course/add" element={<AddCourse />} />
              <Route path="course/manage" element={<ManageCourse />} />
              <Route path="subject/add" element={<AddSubject />} />
              <Route path="subject/manage" element={<ManageSubjects />} />
              <Route path="notify/student" element={<NotifyStudent />} />
              <Route path="notify/faculty" element={<NotifyFaculty />} />
              <Route path="fees" element={<Fees />} />
              <Route path="faculty/manage" element={<ManageFaculty />} />
              <Route path="faculty/add" element={<AddFaculty />} />
              <Route path="students/manage" element={<ManageStudent />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="marks" element={<Marks />} />
            </Route> 
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;