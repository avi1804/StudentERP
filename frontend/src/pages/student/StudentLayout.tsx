import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { LayoutGrid, BookMarked, BookText, UserCircle } from "lucide-react";

export function StudentLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div id="sidebar">
        <div className="logo">
          <div className="logo-icon">ERP</div>
          <div>
            <div>StudentERP</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 400 }}>Management System</div>
          </div>
        </div>

        <div className="nav">
          <div className="nav-lbl">OVERVIEW</div>
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon"><LayoutGrid className="h-4 w-4" style={{ display: 'inline' }} /></span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          
          <div className="nav-lbl">ACADEMIC</div>
          <NavLink to="/dashboard/attendance" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon"><BookMarked className="h-4 w-4" style={{ display: 'inline' }} /></span>
            <span className="nav-text">My Attendance</span>
          </NavLink>
          <NavLink to="/dashboard/results" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon"><BookText className="h-4 w-4" style={{ display: 'inline' }} /></span>
            <span className="nav-text">My Results</span>
          </NavLink>

          <div className="nav-lbl">PROFILE</div>
          <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon"><UserCircle className="h-4 w-4" style={{ display: 'inline' }} /></span>
            <span className="nav-text">My Profile</span>
          </NavLink>
        </div>

        <div className="user-bar">
          <div className="user-avatar" id="u-init">{user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}</div>
          <div>
            <div className="user-name" id="u-name">{user?.full_name || 'Student User'}</div>
            <div className="user-role" id="u-role">STUDENT</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Out</button>
        </div>
      </div>

      <div id="main">
        <div id="topbar">
          <div id="page-title">Student Dashboard</div>
        </div>
        <div id="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
