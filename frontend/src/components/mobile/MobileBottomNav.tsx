import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, Bell } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home', end: true },
  { path: '/dashboard/timetable', icon: Calendar, label: 'Timetable' },
  { path: '/dashboard/subjects', icon: BookOpen, label: 'Subjects' },
  { path: '/dashboard/notices', icon: Bell, label: 'Notices' },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -4px 20px rgba(40, 43, 74, 0.04)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '60px',
          maxWidth: '540px',
          margin: '0 auto',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                height: '100%',
                textDecoration: 'none',
                color: isActive ? '#282B4A' : '#94a3b8',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '28px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(40, 43, 74, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? '#282B4A' : '#94a3b8'}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: '0.1px',
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
