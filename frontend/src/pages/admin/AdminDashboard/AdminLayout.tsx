import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/pages/admin/AdminDashboard/Sidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AdminMobileTopBar } from "@/components/mobile/AdminMobileTopBar";
import { AdminMobileBottomNav } from "@/components/mobile/AdminMobileBottomNav";
import { AdminMobileDrawer } from "@/components/mobile/AdminMobileDrawer";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, ChevronUp, ChevronDown, LogOut, Shield } from "lucide-react";

export function AdminLayout() {
  const { isMobile } = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeState, setActiveState] = useState<'idle' | 'search' | 'notifications' | 'profile'>('idle');
  const [notifIndex, setNotifIndex] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const notificationsList = [
    { id: 1, type: 'System', badge: 'ALERT', title: 'Faculty Registration Pending Approval', subtitle: 'Prof. Mehta submitted profile verification', time: '10m ago' },
    { id: 2, type: 'Course', badge: 'UPDATE', title: 'New Course Added: AI & Robotics', subtitle: 'Added to B.Tech Semester 6 curriculum', time: '1h ago' },
    { id: 3, type: 'Notice', badge: 'NOTICE', title: 'Semester Exam Timetable Published', subtitle: 'Notified to 1,250 active students', time: 'Yesterday' },
  ];

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

      const handleActivity = () => {
        startTimer();
      };

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
    navigate('/login');
  };

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
        <AdminMobileTopBar onMenuClick={() => setIsDrawerOpen(true)} />
        
        <main className="m-content">
          <Outlet />
        </main>
        
        <AdminMobileBottomNav onMenuClick={() => setIsDrawerOpen(true)} />
        <AdminMobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    );
  }

  // ── Desktop Layout ──
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: '#f4f5f8', position: 'relative' }}>
      <Sidebar />
      <div 
        id="main" 
        className="premium-main"
        style={{
          marginLeft: '320px',
          height: '100vh',
          overflowY: 'auto',
          padding: '100px 32px 40px',
          boxSizing: 'border-box',
        }}
      >
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
          {/* Outer reference div for click-outside detection */}
          <div ref={navbarRef} style={{ position: 'relative' }}>

            {/* ── The pill / Dynamic Island capsule (Frosted Glass backdrop blur) ── */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>

                {/* ─── IDLE STATE: three round buttons in an oval pill ─── */}
                {activeState === 'idle' && (
                  <motion.div
                    key="idle-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}
                  >
                    {/* Search circle */}
                    <button
                      onClick={() => setActiveState('search')}
                      title="Search"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(245,245,245,0.9)', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Search size={19} color="#333" strokeWidth={1.6} />
                    </button>

                    {/* Notification circle */}
                    <button
                      onClick={() => setActiveState('notifications')}
                      title="Notifications"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(245,245,245,0.9)', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bell size={19} color="#333" strokeWidth={1.6} />
                      {/* Unread dot */}
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#ef4444', border: '2px solid #F5F5F5',
                      }} />
                    </button>

                    {/* Profile circle */}
                    <button
                      onClick={() => setActiveState(activeState === 'profile' ? 'idle' : 'profile')}
                      title="Profile"
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(245,245,245,0.9)', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <User size={19} color="#333" strokeWidth={1.6} />
                    </button>
                  </motion.div>
                )}

                {/* ─── SEARCH EXPANDED: Dynamic Island morph ─── */}
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
                    <Search size={18} color="#9CA3AF" strokeWidth={1.6} style={{ flexShrink: 0 }} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search students, faculty, courses..."
                      style={{
                        flex: 1, background: 'transparent',
                        border: 'none', outline: 'none',
                        fontSize: 15, fontWeight: 500,
                        color: '#111', fontFamily: 'Space Grotesk, sans-serif',
                        caretColor: '#555',
                      }}
                    />
                  </motion.div>
                )}

                {/* ─── NOTIFICATION EXPANDED: Dynamic Island morph ─── */}
                {activeState === 'notifications' && (
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
                    {/* Highlighted Badge Button */}
                    <button
                      onClick={() => navigate('/admin/dashboard/notify/student')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#6366f1', color: '#ffffff',
                        padding: '7px 13px', borderRadius: 9999, border: 'none',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                        flexShrink: 0, cursor: 'pointer',
                        transition: 'transform 0.15s, background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bell size={13} color="#fff" strokeWidth={2.5} />
                      <span>{notificationsList[notifIndex].badge}</span>
                    </button>

                    {/* Single Notification Content */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].title}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].subtitle} · <span style={{ color: '#9CA3AF', fontWeight: 500 }}>{notificationsList[notifIndex].time}</span>
                      </div>
                    </div>

                    {/* Next / Previous Switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: '#f3f4f6', borderRadius: 999, padding: '3px 6px' }}>
                      <button
                        onClick={() => setNotifIndex(prev => (prev > 0 ? prev - 1 : notificationsList.length - 1))}
                        title="Previous Notification"
                        style={{
                          width: 24, height: 24, borderRadius: '50%', border: 'none',
                          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#374151', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <ChevronUp size={14} strokeWidth={2.5} />
                      </button>

                      <span style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', padding: '0 2px', userSelect: 'none' }}>
                        {notifIndex + 1}/{notificationsList.length}
                      </span>

                      <button
                        onClick={() => setNotifIndex(prev => (prev < notificationsList.length - 1 ? prev + 1 : 0))}
                        title="Next Notification"
                        style={{
                          width: 24, height: 24, borderRadius: '50%', border: 'none',
                          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#374151', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <ChevronDown size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── PROFILE EXPANDED: Dynamic Island morph ─── */}
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
                    {/* Display Picture Avatar (Clickable to AdminProfile) */}
                    <button
                      onClick={() => navigate('/admin/dashboard/AdminProfile')}
                      title="View Profile"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: 0,
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f472b6, #e11d48)',
                        color: '#ffffff', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(225, 29, 72, 0.3)', flexShrink: 0
                      }}>
                        {user?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                          {user?.full_name || 'System Admin'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                          Administrator
                        </div>
                      </div>
                    </button>

                    {/* Action: Logout SVG */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Logout SVG Button */}
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
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ── Main Scrollable Container Box Card (Matching Student Dashboard) ── */}
        <div 
          style={{ 
            background: '#ffffff', 
            borderRadius: '28px', 
            padding: '32px', 
            minHeight: 'calc(100vh - 140px)', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)', 
            border: '1px solid rgba(0,0,0,0.06)',
            boxSizing: 'border-box'
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
