import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./Admin/Admin-Login";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminControl" element={<AdminLogin />} />

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