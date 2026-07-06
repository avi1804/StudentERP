import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/results': 'Results',
  '/dashboard/profile': 'Profile',
};

export function MobileTopBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'StudentERP';
  const initials = user?.full_name?.substring(0, 2).toUpperCase() || 'ST';

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
      {/* Left: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #9aa8ff, #b78efe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 0 10px rgba(183, 142, 254, 0.3)',
          }}
        >
          ERP
        </div>
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
            background: 'linear-gradient(135deg, #9aa8ff, #b78efe)',
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
