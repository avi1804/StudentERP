import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, GraduationCap, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutGrid, label: 'Home', end: true },
  { path: '/admin/dashboard/students/manage', icon: Users, label: 'Students' },
  { path: '/admin/dashboard/faculty/manage', icon: GraduationCap, label: 'Faculty' },
  { id: 'menu', icon: Menu, label: 'More' },
];

interface AdminMobileBottomNavProps {
  onMenuClick: () => void;
}

export function AdminMobileBottomNav({ onMenuClick }: AdminMobileBottomNavProps) {
  const location = useLocation();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const getActiveIndex = () => {
    const idx = navItems.findIndex(item => {
      if (item.id === 'menu') return false; // Menu doesn't stay active
      if (item.end) return location.pathname === item.path;
      return item.path && location.pathname.startsWith(item.path);
    });
    return idx >= 0 ? idx : -1; // -1 if we are on a page not in the bottom nav
  };

  const activeIndex = getActiveIndex();

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
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
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
        {activeIndex >= 0 && (
          <motion.div
            layoutId="admin-mobile-nav-indicator"
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
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
              }}
            />
          </motion.div>
        )}

        {navItems.map((item, index) => {
          if (item.id === 'menu') {
            const Icon = item.icon;
            return (
              <button
                key="menu"
                onClick={onMenuClick}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '4px', flex: 1, height: '100%', background: 'transparent', border: 'none',
                  position: 'relative', overflow: 'hidden', WebkitTapHighlightColor: 'transparent',
                }}
              >
                <motion.div whileTap={{ scale: 0.85 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <Icon size={22} strokeWidth={1.8} style={{ color: '#7a80a1' }} />
                  <span style={{ fontSize: '10px', fontWeight: 400, color: '#7a80a1', letterSpacing: '0.02em' }}>{item.label}</span>
                </motion.div>
              </button>
            );
          }

          const isActive = item.end
              ? location.pathname === item.path
              : (item.path && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path || '#'}
              end={item.end}
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
                    color: isActive ? '#f59e0b' : '#7a80a1',
                    transition: 'color 0.2s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#f59e0b' : '#7a80a1',
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
