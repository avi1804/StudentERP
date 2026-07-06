import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Menu } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/faculty/dashboard': 'Faculty Dashboard',
  '/faculty/attendance': 'Attendance',
  '/faculty/attendance-report': 'Attendance Report',
  '/faculty/marks': 'Enter Marks',
  '/faculty/results': 'View Results',
};

interface FacultyMobileTopBarProps {
  onMenuClick: () => void;
}

export function FacultyMobileTopBar({ onMenuClick }: FacultyMobileTopBarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'Faculty Portal';
  const initials = user?.full_name?.substring(0, 2).toUpperCase() || 'FA';

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
        background: 'rgba(10, 14, 23, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#ebedfb',
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
            color: '#ebedfb',
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
            background: 'linear-gradient(135deg, #4f8ef7, #9aa8ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff',
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'transparent',
            color: '#7a80a1',
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
