import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Menu } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/dashboard/department/manage': 'Manage Departments',
  '/admin/dashboard/students/manage': 'Manage Students',
  '/admin/dashboard/faculty/manage': 'Manage Faculty',
  '/admin/dashboard/subject/manage': 'Manage Subjects',
  '/admin/dashboard/notify/faculty': 'Faculty Notices',
  '/admin/dashboard/students/add': 'Add Student',
  '/admin/dashboard/faculty/add': 'Add Faculty',
  '/admin/dashboard/subject/add': 'Add Subject',
  '/admin/dashboard/notify/student': 'Post Notice',
};

interface AdminMobileTopBarProps {
  onMenuClick: () => void;
}

export function AdminMobileTopBar({ onMenuClick }: AdminMobileTopBarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'Admin Panel';
  const initials = user?.full_name?.substring(0, 2).toUpperCase() || 'AD';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'rgba(40, 43, 74, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(238, 235, 218, 0.12)',
      }}
    >
      {/* Left: Hamburger + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuClick}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(238, 235, 218, 0.1)',
            border: 'none',
            color: '#EEEBDA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </button>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#EEEBDA',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </span>
      </div>

      {/* Right: Avatar + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #282B4A, #3a3e68)',
            border: '1px solid rgba(238, 235, 218, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#EEEBDA',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid rgba(238, 235, 218, 0.15)',
            background: 'transparent',
            color: 'rgba(238, 235, 218, 0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
