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
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '28px 24px 20px' }}>
        <div 
          className="logo-icon" 
          style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '14px', 
            background: '#ffffff', 
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <img 
            src="/indus-logo.png" 
            alt="Indus Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="logo-text">
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>IndusERP</h2>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: 500 }}>Admin Portal</p>
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
