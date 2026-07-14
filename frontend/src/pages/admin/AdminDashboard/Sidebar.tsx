import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS, type NavItem } from "@/pages/admin/AdminDashboard/DashboardData";
import { GraduationCap } from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (window.innerWidth < 1024 && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="premium-student-sidebar">
      <div className="logo-area">
        <div className="logo-icon">
          <GraduationCap size={28} />
        </div>
        <div className="logo-text">
          <h2>Student ERP</h2>
          <p>Learn. Manage. Grow.</p>
        </div>
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map((item, index) => {
          if ('isCategory' in item && item.isCategory) {
            return (
              <div key={index} style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '24px 0 8px 16px' }}>
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
              <span className="nav-icon"><Icon size={20} /></span>
              <span className="nav-text">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
