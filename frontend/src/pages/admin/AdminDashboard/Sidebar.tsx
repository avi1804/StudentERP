import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS, type NavItem } from "@/pages/admin/AdminDashboard/DashboardData";

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const location = useLocation();

  const handleNavigate = () => {
    if (window.innerWidth < 1024 && onNavigate) {
      onNavigate();
    }
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
        {NAV_ITEMS.map((item, index) => {
          if ('isCategory' in item && item.isCategory) {
            return (
              <div key={index} className="nav-lbl">
                {item.label}
              </div>
            );
          }

          const { label, icon: Icon, path } = item as (NavItem & { isCategory?: false; path: string });
          
          return (
            <NavLink
              key={label}
              to={path}
              end={path === "/admin/dashboard"}
              onClick={handleNavigate}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <span className="nav-icon"><Icon className="h-4 w-4" style={{ display: 'inline' }} /></span>
              <span className="nav-text">{label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="user-bar">
        <div className="user-avatar" id="u-init">AD</div>
        <div>
          <div className="user-name" id="u-name">System Administrator</div>
          <div className="user-role" id="u-role">ADMIN</div>
        </div>
        <button className="logout-btn">Out</button>
      </div>
    </div>
  );
}
