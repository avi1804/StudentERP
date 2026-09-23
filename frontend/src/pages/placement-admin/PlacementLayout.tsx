import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, User, ChevronUp, ChevronDown, LogOut, Briefcase,
  LayoutDashboard, Building2, CalendarDays, FileText, GraduationCap,
  BarChart3, Download, Settings, Menu, X, ChevronRight
} from "lucide-react";
import GradualBlur from "@/components/GradualBlur";
import { apiClient as api } from "../../api/axios";

const NAV_ITEMS = [
  { path: '/placement-admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/placement-admin/companies', label: 'Companies', icon: Building2 },
  { path: '/placement-admin/drives', label: 'Placement Drives', icon: CalendarDays },
  { path: '/placement-admin/applications', label: 'Student Applications', icon: FileText },
  { path: '/placement-admin/eligible', label: 'Eligible Students', icon: GraduationCap },
  { path: '/placement-admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/placement-admin/reports', label: 'Reports', icon: Download },
  { path: '/placement-admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/placement-admin/settings', label: 'Settings', icon: Settings },
];

function PlacementSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const handleNavigate = () => {
    if (window.innerWidth < 1024 && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div
      className="premium-student-sidebar"
      style={{
        background: 'rgba(247, 245, 236, 0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(40, 43, 74, 0.12)',
        boxShadow: '0 10px 35px rgba(40, 43, 74, 0.1)',
      }}
    >
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '28px 24px 20px' }}>
        <div 
          className="logo-icon" 
          style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '14px', 
            background: '#ffffff', 
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.06)',
            border: '1px solid rgba(40, 43, 74, 0.1)',
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
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#282B4A', margin: 0, letterSpacing: '-0.02em' }}>IndusERP</h2>
          <p style={{ fontSize: '12px', color: 'rgba(40, 43, 74, 0.7)', margin: '2px 0 0 0', fontWeight: 500 }}>Placement Cell</p>
        </div>
      </div>

      <div className="nav-links">
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(40, 43, 74, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '24px 0 8px 16px' }}>
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleNavigate}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <span className="nav-icon"><Icon size={20} /></span>
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export function PlacementLayout() {
  const { isMobile } = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeState, setActiveState] = useState<'idle' | 'search' | 'notifications' | 'profile'>('idle');
  const [notifIndex, setNotifIndex] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [notificationsList, setNotificationsList] = useState<any[]>([
    { id: 'default', type: 'System', badge: 'LIVE', title: 'Placement Portal Active', subtitle: 'Checking student applications & company updates...', time: 'Just now', link: '/placement-admin' }
  ]);

  const getBadgeTheme = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'STUDENT':
        return { bg: '#059669', text: '#ffffff', glow: 'rgba(5,150,105,0.25)' };
      case 'ADMIN':
        return { bg: '#282B4A', text: '#EEEBDA', glow: 'rgba(40,43,74,0.25)' };
      case 'DRIVE':
        return { bg: '#7c3aed', text: '#ffffff', glow: 'rgba(124,58,237,0.25)' };
      case 'PLACEMENT':
        return { bg: '#d97706', text: '#ffffff', glow: 'rgba(217,119,6,0.25)' };
      default:
        return { bg: '#282B4A', text: '#EEEBDA', glow: 'rgba(40,43,74,0.2)' };
    }
  };

  const fetchNotifications = () => {
    api.get('/notifications/my-notifications')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setNotificationsList(res.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  // Auto-close Dynamic Island on 5s inactivity
  useEffect(() => {
    if (activeState === 'search' || activeState === 'notifications' || activeState === 'profile') {
      const startTimer = () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = setTimeout(() => {
          setActiveState('idle');
        }, 5000);
      };

      startTimer();
      const handleActivity = () => startTimer();

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);

      return () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
      };
    } else {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
  }, [activeState, notifIndex]);

  // Click-outside and Escape key to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setActiveState('idle');
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveState('idle');
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f8' }}>
        <header style={{
          height: '56px', background: '#fff', borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', flexShrink: 0,
        }}>
          <button onClick={() => setIsDrawerOpen(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#374151', padding: '4px' }}>
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="#282B4A" />
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#282B4A' }}>Placement ERP</span>
          </div>
        </header>

        <main style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>

        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }}
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 201 }}
              >
                <PlacementSidebar onNavigate={() => setIsDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Desktop Layout ──
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: '#f4f5f8', position: 'relative' }}>
      <PlacementSidebar />

      {/* ── Permanently Fixed Dynamic Island Navbar ── */}
      <div
        id="topbar"
          style={{
            position: 'fixed',
            top: '16px',
            left: 'calc(320px + (100vw - 340px) / 2)',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <div ref={navbarRef} style={{ position: 'relative' }}>
            {/* ── Dynamic Island Pill ── */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              style={{
                background: 'rgba(247, 245, 236, 0.94)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(40, 43, 74, 0.12)',
                boxShadow: '0 10px 35px rgba(40, 43, 74, 0.1)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {/* IDLE STATE */}
                {activeState === 'idle' && (
                  <motion.div
                    key="idle-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}
                  >
                    {/* Search button */}
                    <button
                      onClick={() => setActiveState('search')}
                      title="Search"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(40, 43, 74, 0.06)', border: '1px solid rgba(40, 43, 74, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Search size={19} color="#282B4A" strokeWidth={1.8} />
                    </button>

                    {/* Notifications button */}
                    <button
                      onClick={() => setActiveState('notifications')}
                      title="Notifications"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(40, 43, 74, 0.06)', border: '1px solid rgba(40, 43, 74, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bell size={19} color="#282B4A" strokeWidth={1.8} />
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#ef4444', border: '2px solid #EEEBDA',
                      }} />
                    </button>

                    {/* Profile button */}
                    <button
                      onClick={() => setActiveState('profile')}
                      title="Profile"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(40, 43, 74, 0.06)', border: '1px solid rgba(40, 43, 74, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <User size={19} color="#282B4A" strokeWidth={1.8} />
                    </button>
                  </motion.div>
                )}

                {/* SEARCH EXPANDED */}
                {activeState === 'search' && (
                  <motion.div
                    key="search-expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      width: 380, height: 60,
                      padding: '0 20px', gap: 10,
                    }}
                  >
                    <Search size={18} color="#282B4A" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search companies, drives, applicants..."
                      style={{
                        flex: 1, background: 'transparent',
                        border: 'none', outline: 'none',
                        fontSize: 15, fontWeight: 500,
                        color: '#282B4A', fontFamily: 'Space Grotesk, sans-serif',
                        caretColor: '#282B4A',
                      }}
                    />
                  </motion.div>
                )}

                {/* NOTIFICATION EXPANDED */}
                {activeState === 'notifications' && (() => {
                  const currentNotif = notificationsList[notifIndex] || notificationsList[0] || {
                    id: 'fallback', badge: 'NOTICE', title: 'No notifications', subtitle: 'You are all caught up!', time: 'Now'
                  };
                  const theme = getBadgeTheme(currentNotif.badge);

                  return (
                    <motion.div
                      key="notification-expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        display: 'flex', alignItems: 'center',
                        width: 450, height: 60,
                        padding: '0 16px', gap: 12,
                      }}
                    >
                      <button
                        onClick={() => {
                          if (currentNotif.link) {
                            navigate(currentNotif.link);
                            setActiveState('idle');
                          } else {
                            navigate('/placement-admin/notifications');
                          }
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: theme.bg, color: theme.text,
                          padding: '7px 12px', borderRadius: 9999, border: 'none',
                          fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
                          boxShadow: `0 4px 12px ${theme.glow}`,
                          flexShrink: 0, cursor: 'pointer',
                          transition: 'transform 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        title={`Open ${currentNotif.type || 'Notification'}`}
                      >
                        <Bell size={13} color={theme.text} strokeWidth={2.5} />
                        <span>{currentNotif.badge}</span>
                      </button>

                      <div 
                        onClick={() => {
                          if (currentNotif.link) {
                            navigate(currentNotif.link);
                            setActiveState('idle');
                          }
                        }}
                        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: currentNotif.link ? 'pointer' : 'default' }}
                        title={currentNotif.link ? "Click to view details" : undefined}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#282B4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {currentNotif.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#525677', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {currentNotif.subtitle} · <span style={{ color: '#7E82A4', fontWeight: 500 }}>{currentNotif.time}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: 'rgba(40, 43, 74, 0.08)', borderRadius: 999, padding: '3px 6px' }}>
                        <button
                          onClick={() => setNotifIndex(prev => (prev > 0 ? prev - 1 : notificationsList.length - 1))}
                          title="Previous"
                          style={{
                            width: 24, height: 24, borderRadius: '50%', border: 'none',
                            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#282B4A',
                          }}
                        >
                          <ChevronUp size={14} strokeWidth={2.5} />
                        </button>

                        <span style={{ fontSize: 11, fontWeight: 700, color: '#282B4A', padding: '0 2px', userSelect: 'none' }}>
                          {notifIndex + 1}/{notificationsList.length}
                        </span>

                        <button
                          onClick={() => setNotifIndex(prev => (prev < notificationsList.length - 1 ? prev + 1 : 0))}
                          title="Next"
                          style={{
                            width: 24, height: 24, borderRadius: '50%', border: 'none',
                            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#282B4A',
                          }}
                        >
                          <ChevronDown size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* PROFILE EXPANDED */}
                {activeState === 'profile' && (
                  <motion.div
                    key="profile-expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: 320, height: 60,
                      padding: '0 14px', gap: 12,
                    }}
                  >
                    <button
                      onClick={() => navigate('/placement-admin/settings')}
                      title="View Settings"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: 0,
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #282B4A, #3a3e68)',
                        color: '#EEEBDA', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(40, 43, 74, 0.25)', flexShrink: 0
                      }}>
                        {user?.full_name?.substring(0, 2).toUpperCase() || 'PA'}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#282B4A', lineHeight: 1.2 }}>
                          {user?.full_name || 'Placement Officer'}
                        </div>
                        <div style={{ fontSize: 11, color: '#525677', marginTop: 2 }}>
                          Placement Admin
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      title="Logout"
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#EF4444',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <LogOut size={16} strokeWidth={2.2} color="#EF4444" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

      {/* ── Main Professional Box Container (Starts BELOW Dynamic Island, Scrolls ONLY Inside) ── */}
      <div
        style={{
          position: 'fixed',
          top: '84px',
          bottom: '20px',
          left: '320px',
          right: '20px',
          background: 'rgba(247, 245, 236, 0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRadius: '28px',
          boxShadow: '0 10px 35px rgba(40, 43, 74, 0.1)',
          border: '1px solid rgba(40, 43, 74, 0.12)',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* ── Scrollable Dashboard Content Area ── */}
        <div
          id="dashboard-scroll-area"
          style={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            paddingTop: '36px',
            paddingBottom: '40px',
            paddingLeft: '40px',
            paddingRight: '40px',
          }}
        >
          <Outlet />
        </div>

        {/* ── Bottom Gradual Blur ── */}
        <GradualBlur
          target="parent"
          position="bottom"
          height="4rem"
          strength={1.5}
          divCount={5}
          curve="bezier"
          exponential={true}
          opacity={0.9}
        />
      </div>
    </div>
  );
}
