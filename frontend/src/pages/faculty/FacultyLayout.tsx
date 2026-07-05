import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, BookMarked, BookText } from "lucide-react";

import { useAuthStore } from "../../store/authStore";

export function FacultySidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleNavigate = () => {};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
        <NavLink to="/faculty/dashboard" end onClick={handleNavigate} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon"><LayoutGrid className="h-4 w-4" style={{ display: 'inline' }} /></span>
          <span className="nav-text">Dashboard</span>
        </NavLink>
        
        <div className="nav-lbl">ACADEMIC</div>
        <NavLink to="/faculty/attendance" onClick={handleNavigate} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon"><BookMarked className="h-4 w-4" style={{ display: 'inline' }} /></span>
          <span className="nav-text">Attendance</span>
        </NavLink>
        <NavLink to="/faculty/attendance-report" onClick={handleNavigate} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon"><BookText className="h-4 w-4" style={{ display: 'inline' }} /></span>
          <span className="nav-text">Attendance Report</span>
        </NavLink>
        <NavLink to="/faculty/marks" onClick={handleNavigate} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon"><BookText className="h-4 w-4" style={{ display: 'inline' }} /></span>
          <span className="nav-text">Enter Marks</span>
        </NavLink>
        <NavLink to="/faculty/results" onClick={handleNavigate} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon"><BookText className="h-4 w-4" style={{ display: 'inline' }} /></span>
          <span className="nav-text">View Results</span>
        </NavLink>
      </div>

      <div className="user-bar">
        <div className="user-avatar" id="u-init">FA</div>
        <div>
          <div className="user-name" id="u-name">{user?.full_name || 'Faculty User'}</div>
          <div className="user-role" id="u-role">FACULTY</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Out</button>
      </div>
    </div>
  );
}

export function FacultyLayout() {
  return (
    <>
      <FacultySidebar />
      <div id="main">
        <div id="topbar">
          <div id="page-title">Faculty Dashboard</div>
        </div>
        <div id="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
