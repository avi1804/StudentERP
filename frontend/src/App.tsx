import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./Admin/Admin-Login";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import { AdminLayout } from "./Admin/AdminDashboard/AdminLayout";
import { DashboardHome } from "./Admin/AdminDashboard/DashboardHome";
import { AddCourse } from "./Admin/AdminDashboard/AddCourse";
import { ManageCourse } from "./Admin/AdminDashboard/ManageCourse";
import UpdateAdminProfile from "./Admin/AdminDashboard/UpdateAdminProfile";
import AddSubject from "./Admin/AdminDashboard/AddSubject";
import ManageSubjects from "./Admin/AdminDashboard/ManageSubject";
import { NotifyStudent } from "./Admin/AdminDashboard/NotifyStudent";
import NotifyStaff from "./Admin/AdminDashboard/NotifyStaff";
import ManageStaff from "./Admin/AdminDashboard/ManageStaff";
import ManageStudent from "./Admin/AdminDashboard/ManageStudent";
import AddStudent from "./Admin/AdminDashboard/AddStudent";
import AddStaff from "./Admin/AdminDashboard/AddStaff";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminControl" element={<AdminLogin />} />
        <Route path="/Admin-Dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="AdminProfile" element={<UpdateAdminProfile />} />
          <Route path="course/add" element={<AddCourse />} />
          <Route path="course/manage" element={<ManageCourse />} />
          <Route path="subject/add" element={<AddSubject />} />
          <Route path="subject/manage" element={<ManageSubjects />} />
          <Route path="notify/student" element={<NotifyStudent />} />
          <Route path="notify/staff" element={<NotifyStaff />} />
          <Route path="staff/manage" element={<ManageStaff />} />
          <Route path="staff/add" element={<AddStaff />} />
          <Route path="students/manage" element={<ManageStudent />} />
          <Route path="students/add" element={<AddStudent />} />
          
         
        </Route> 

        {/* Protected Routes (Placeholders until UI is provided) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<div className="p-10 text-white">Admin Dashboard Loaded Securely!</div>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;