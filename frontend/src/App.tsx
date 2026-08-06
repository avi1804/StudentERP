import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";

// Lazy Loaded Pages
const Login = React.lazy(() => import("./pages/Login"));
// Lazy Loaded Student Dashboard Pages
const StudentLayout = React.lazy(() => import("./pages/student/StudentLayout").then(m => ({ default: m.StudentLayout })));
const StudentHome = React.lazy(() => import("./pages/student/StudentHome").then(m => ({ default: m.StudentHome })));
const MyAttendance = React.lazy(() => import("./pages/student/MyAttendance").then(m => ({ default: m.MyAttendance })));
const MyResults = React.lazy(() => import("./pages/student/MyResults").then(m => ({ default: m.MyResults })));
const MySubjects = React.lazy(() => import("./pages/student/MySubjects").then(m => ({ default: m.MySubjects })));
const MyFees = React.lazy(() => import("./pages/student/MyFees").then(m => ({ default: m.MyFees })));
const MyAssignments = React.lazy(() => import("./pages/student/MyAssignments").then(m => ({ default: m.MyAssignments })));
const MyTimetable = React.lazy(() => import("./pages/student/MyTimetable").then(m => ({ default: m.MyTimetable })));
const PlacementCell = React.lazy(() => import("./pages/student/PlacementCell").then(m => ({ default: m.PlacementCell })));
const MyComplaints = React.lazy(() => import("./pages/student/MyComplaints").then(m => ({ default: m.MyComplaints })));
const MyIdCard = React.lazy(() => import("./pages/student/MyIdCard").then(m => ({ default: m.MyIdCard })));
const MyNotices = React.lazy(() => import("./pages/student/MyNotices").then(m => ({ default: m.MyNotices })));
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
const ManageDepartment = React.lazy(() => import("./pages/admin/AdminDashboard/ManageDepartment").then(m => ({ default: m.ManageDepartment })));
const ManageComplaints = React.lazy(() => import("./pages/admin/AdminDashboard/ManageComplaints").then(m => ({ default: m.ManageComplaints })));

// Lazy Loaded Fee Admin Pages
const FeeDashboard = React.lazy(() => import("./pages/admin/fees/FeeDashboard").then(m => ({ default: m.FeeDashboard })));
const FeeStructure = React.lazy(() => import("./pages/admin/fees/FeeStructure").then(m => ({ default: m.FeeStructure })));
const StudentFees = React.lazy(() => import("./pages/admin/fees/StudentFees").then(m => ({ default: m.StudentFees })));
const Payments = React.lazy(() => import("./pages/admin/fees/Payments").then(m => ({ default: m.Payments })));
const FeeReports = React.lazy(() => import("./pages/admin/fees/FeeReports").then(m => ({ default: m.FeeReports })));

// Lazy Loaded Faculty Dashboard Pages
const FacultyLayout = React.lazy(() => import("./pages/faculty/FacultyLayout").then(m => ({ default: m.FacultyLayout })));
const FacultyDashboard = React.lazy(() => import("./pages/faculty/FacultyDashboard").then(m => ({ default: m.FacultyDashboard })));
const AttendanceManager = React.lazy(() => import("./pages/faculty/AttendanceManager").then(m => ({ default: m.AttendanceManager })));
const AttendanceReport = React.lazy(() => import("./pages/faculty/AttendanceReport").then(m => ({ default: m.AttendanceReport })));
const AssignmentManager = React.lazy(() => import("./pages/faculty/AssignmentManager").then(m => ({ default: m.AssignmentManager })));
const MarksManager = React.lazy(() => import("./pages/faculty/MarksManager").then(m => ({ default: m.MarksManager })));
const ResultCard = React.lazy(() => import("./pages/faculty/ResultCard").then(m => ({ default: m.ResultCard })));
const AssignSubstitute = React.lazy(() => import("./pages/faculty/AssignSubstitute").then(m => ({ default: m.AssignSubstitute })));

// Lazy Loaded Placement Admin Pages
const PlacementLayout = React.lazy(() => import("./pages/placement-admin/PlacementLayout").then(m => ({ default: m.PlacementLayout })));
const PlacementDashboard = React.lazy(() => import("./pages/placement-admin/PlacementDashboard").then(m => ({ default: m.PlacementDashboard })));
const Companies = React.lazy(() => import("./pages/placement-admin/Companies").then(m => ({ default: m.Companies })));
const PlacementDrives = React.lazy(() => import("./pages/placement-admin/PlacementDrives").then(m => ({ default: m.PlacementDrives })));
const StudentApplications = React.lazy(() => import("./pages/placement-admin/StudentApplications").then(m => ({ default: m.StudentApplications })));
const EligibleStudents = React.lazy(() => import("./pages/placement-admin/EligibleStudents").then(m => ({ default: m.EligibleStudents })));
const Analytics = React.lazy(() => import("./pages/placement-admin/Analytics").then(m => ({ default: m.Analytics })));
const Reports = React.lazy(() => import("./pages/placement-admin/Reports").then(m => ({ default: m.Reports })));
const Notifications = React.lazy(() => import("./pages/placement-admin/Notifications").then(m => ({ default: m.Notifications })));
const PlacementSettings = React.lazy(() => import("./pages/placement-admin/Settings").then(m => ({ default: m.PlacementSettings })));

// Lazy Loaded Event Pages
const AdminEvents = React.lazy(() => import("./pages/admin/AdminDashboard/AdminEvents").then(m => ({ default: m.AdminEvents })));
const EventForm = React.lazy(() => import("./pages/admin/AdminDashboard/EventForm").then(m => ({ default: m.EventForm })));
const EventsList = React.lazy(() => import("./pages/events/EventsList").then(m => ({ default: m.EventsList })));
const EventDetail = React.lazy(() => import("./pages/events/EventDetail").then(m => ({ default: m.EventDetail })));

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
                <Route path="department/manage" element={<ManageDepartment />} />
                <Route path="complaints" element={<ManageComplaints />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/add" element={<EventForm />} />
                <Route path="events/edit/:id" element={<EventForm />} />
                
                {/* Fee Management Routes */}
                <Route path="fees" element={<FeeDashboard />} />
                <Route path="fees/structures" element={<FeeStructure />} />
                <Route path="fees/students" element={<StudentFees />} />
                <Route path="fees/payments" element={<Payments />} />
                <Route path="fees/reports" element={<FeeReports />} />
              </Route> 
            </Route>

            {/* Student Routes (Visible without login) */}
            <Route path="/dashboard" element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="results" element={<MyResults />} />
              <Route path="subjects" element={<MySubjects />} />
              <Route path="assignments" element={<MyAssignments />} />
              <Route path="timetable" element={<MyTimetable />} />
              <Route path="placement" element={<PlacementCell />} />
              <Route path="complaints" element={<MyComplaints />} />
              <Route path="idcard" element={<MyIdCard />} />
              <Route path="notices" element={<MyNotices />} />
              <Route path="fees" element={<MyFees />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="events" element={<EventsList />} />
              <Route path="events/detail/:id" element={<EventDetail />} />
            </Route>
            
            {/* Faculty Routes */}
            <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="attendance" element={<AttendanceManager />} />
                <Route path="attendance-report" element={<AttendanceReport />} />
                <Route path="assignments" element={<AssignmentManager />} />
                <Route path="marks" element={<MarksManager />} />
                <Route path="results" element={<ResultCard />} />
                <Route path="events" element={<EventsList />} />
                <Route path="events/detail/:id" element={<EventDetail />} />
                <Route path="assign-substitute" element={<AssignSubstitute />} />
              </Route>
            </Route>

            {/* Placement Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['placement_admin']} />}>
              <Route path="/placement-admin" element={<PlacementLayout />}>
                <Route index element={<PlacementDashboard />} />
                <Route path="companies" element={<Companies />} />
                <Route path="drives" element={<PlacementDrives />} />
                <Route path="applications" element={<StudentApplications />} />
                <Route path="eligible" element={<EligibleStudents />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<PlacementSettings />} />
              </Route>
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ChatWidget />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;