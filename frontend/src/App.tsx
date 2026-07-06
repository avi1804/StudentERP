import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ProtectedRoute from "./components/ProtectedRoute";

// Lazy Loaded Pages
const Login = React.lazy(() => import("./pages/Login"));
// Lazy Loaded Student Dashboard Pages
const StudentLayout = React.lazy(() => import("./pages/student/StudentLayout").then(m => ({ default: m.StudentLayout })));
const StudentHome = React.lazy(() => import("./pages/student/StudentHome").then(m => ({ default: m.StudentHome })));
const MyAttendance = React.lazy(() => import("./pages/student/MyAttendance").then(m => ({ default: m.MyAttendance })));
const MyResults = React.lazy(() => import("./pages/student/MyResults").then(m => ({ default: m.MyResults })));
const MyProfile = React.lazy(() => import("./pages/student/MyProfile").then(m => ({ default: m.MyProfile })));
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
const ManageFaculty = React.lazy(() => import("./pages/admin/AdminDashboard/ManageFaculty"));
const ManageStudent = React.lazy(() => import("./pages/admin/AdminDashboard/ManageStudent"));
const AddStudent = React.lazy(() => import("./pages/admin/AdminDashboard/AddStudent"));
const AddFaculty = React.lazy(() => import("./pages/admin/AdminDashboard/AddFaculty"));
// const Attendance = React.lazy(() => import("./pages/admin/AdminDashboard/Attendance"));
// const Marks = React.lazy(() => import("./pages/admin/AdminDashboard/Marks"));

// Lazy Loaded Faculty Dashboard Pages
const FacultyLayout = React.lazy(() => import("./pages/faculty/FacultyLayout").then(m => ({ default: m.FacultyLayout })));
const FacultyDashboard = React.lazy(() => import("./pages/faculty/FacultyDashboard").then(m => ({ default: m.FacultyDashboard })));
const AttendanceManager = React.lazy(() => import("./pages/faculty/AttendanceManager").then(m => ({ default: m.AttendanceManager })));
const AttendanceReport = React.lazy(() => import("./pages/faculty/AttendanceReport").then(m => ({ default: m.AttendanceReport })));
const MarksManager = React.lazy(() => import("./pages/faculty/MarksManager").then(m => ({ default: m.MarksManager })));
const ResultCard = React.lazy(() => import("./pages/faculty/ResultCard").then(m => ({ default: m.ResultCard })));

// Loader Component
const LoadingSpinner = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-500 border-t-transparent"></div>
  </div>
);

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="AdminProfile" element={<UpdateAdminProfile />} />
                <Route path="course/add" element={<AddCourse />} />
                <Route path="course/manage" element={<ManageCourse />} />
                <Route path="subject/add" element={<AddSubject />} />
                <Route path="subject/manage" element={<ManageSubjects />} />
                <Route path="notify/student" element={<NotifyStudent />} />
                <Route path="notify/faculty" element={<NotifyFaculty />} />
                <Route path="faculty/manage" element={<ManageFaculty />} />
                <Route path="faculty/add" element={<AddFaculty />} />
                <Route path="students/manage" element={<ManageStudent />} />
                <Route path="students/add" element={<AddStudent />} />
                <Route path="attendance" element={<AttendanceManager />} />
                <Route path="attendance-report" element={<AttendanceReport />} />
                <Route path="marks" element={<MarksManager />} />
                <Route path="results" element={<ResultCard />} />
              </Route> 
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/dashboard" element={<StudentLayout />}>
                <Route index element={<StudentHome />} />
                <Route path="attendance" element={<MyAttendance />} />
                <Route path="results" element={<MyResults />} />
                <Route path="profile" element={<MyProfile />} />
              </Route>
            </Route>
            
            {/* Faculty Routes */}
            <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="attendance" element={<AttendanceManager />} />
                <Route path="attendance-report" element={<AttendanceReport />} />
                <Route path="marks" element={<MarksManager />} />
                <Route path="results" element={<ResultCard />} />
              </Route>
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;