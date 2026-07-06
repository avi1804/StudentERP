import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookMarked, Award, UserCircle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home', end: true },
  { path: '/dashboard/attendance', icon: BookMarked, label: 'Attendance' },
  { path: '/dashboard/results', icon: Award, label: 'Results' },
  { path: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const getActiveIndex = () => {
    const idx = navItems.findIndex(item => {
      if (item.end) return location.pathname === item.path;
      return location.pathname.startsWith(item.path);
    });
    return idx >= 0 ? idx : 0;
  };

  const activeIndex = getActiveIndex();

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(183, 142, 254, 0.1)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '64px',
          position: 'relative',
        }}
      >
        {/* Animated active indicator */}
        <motion.div
          layoutId="mobile-nav-indicator"
          style={{
            position: 'absolute',
            top: 0,
            left: `${(activeIndex / navItems.length) * 100}%`,
            width: `${100 / navItems.length}%`,
            height: '3px',
            display: 'flex',
            justifyContent: 'center',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div
            style={{
              width: '32px',
              height: '3px',
              borderRadius: '0 0 4px 4px',
              background: 'linear-gradient(90deg, #9aa8ff, #b78efe)',
              boxShadow: '0 0 12px rgba(183, 142, 254, 0.5)',
            }}
          />
        </motion.div>

        {navItems.map((item, index) => {
          const isActive =
            item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleRipple}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                flex: 1,
                height: '100%',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? '#b78efe' : '#7a80a1',
                    transition: 'color 0.2s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#b78efe' : '#7a80a1',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
