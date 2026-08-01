import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, CheckSquare, FileText, BookOpen, BarChart2,
  Search, Bell, User, ChevronUp, ChevronDown, LogOut, GraduationCap, Shield, ClipboardList
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { FacultyMobileTopBar } from "../../components/mobile/FacultyMobileTopBar";
import { FacultyMobileBottomNav } from "../../components/mobile/FacultyMobileBottomNav";
import { FacultyMobileDrawer } from "../../components/mobile/FacultyMobileDrawer";
import { useAuthStore } from "../../store/authStore";
import { apiClient as api } from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export function FacultySidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/faculty/dashboard", label: "Dashboard", icon: LayoutGrid, end: true },
    { to: "/faculty/attendance", label: "Attendance", icon: CheckSquare },
    { to: "/faculty/attendance-report", label: "Attendance Report", icon: FileText },
    { to: "/faculty/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/faculty/marks", label: "Enter Marks", icon: BookOpen },
    { to: "/faculty/results", label: "View Results", icon: BarChart2 },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        bottom: '20px',
        width: '280px',
        background: '#ffffff',
        borderRadius: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        boxSizing: 'border-box',
        zIndex: 100,
      }}
    >
      <div>
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '16px',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}
          >
            ERP
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.3px' }}>
              StudentERP
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>Faculty Portal</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#a1a1aa', paddingLeft: '12px', marginBottom: '8px', letterSpacing: '0.5px' }}>
            ACADEMIC CONTROLS
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#6366f1' : '#52525b',
                  background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} color={isActive ? '#6366f1' : '#71717a'} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FacultyLayout() {
  const { isMobile } = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeState, setActiveState] = useState<'idle' | 'search' | 'notifications' | 'profile'>('idle');
  const [notifIndex, setNotifIndex] = useState(0);
  const [teacherName, setTeacherName] = useState<string>('');
  const navbarRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.full_name && user.full_name !== 'Faculty Member') {
      setTeacherName(user.full_name);
    }
    api.get('/faculty-dash/dashboard').then(res => {
      if (res.data?.name) {
        setTeacherName(res.data.name);
        if (user && user.full_name !== res.data.name) {
          setUser({ ...user, full_name: res.data.name });
        }
      }
    }).catch(console.error);
  }, [user, setUser]);

  const notificationsList = [
    { id: 1, type: 'Academic', badge: 'MARKS', title: 'Mid-Sem Marks Submission Deadline', subtitle: 'Submit 7th Sem marks before Friday 5 PM', time: '30m ago' },
    { id: 2, type: 'Notice', badge: 'ATTENDANCE', title: 'Low Attendance Alert Sent', subtitle: 'Notified 12 students in Machine Learning', time: '2h ago' },
    { id: 3, type: 'System', badge: 'CURRICULUM', title: 'New Course Syllabus Updated', subtitle: 'Cloud Computing syllabus revision uploaded', time: 'Yesterday' },
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
        <FacultyMobileTopBar onMenuClick={() => setIsDrawerOpen(true)} />
        
        <main className="m-content">
          <Outlet />
        </main>
        
        <FacultyMobileBottomNav onMenuClick={() => setIsDrawerOpen(true)} />
        <FacultyMobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    );
  }

  // ── Desktop Layout matching Admin Layout Dynamic Island + Scrollable Card Container ──
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: '#f4f5f8', position: 'relative' }}>
      <FacultySidebar />
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
            zIndex: 90,
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

                {/* ─── SEARCH EXPANDED ─── */}
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
                      placeholder="Search subjects, students, marks..."
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

                {/* ─── NOTIFICATION EXPANDED ─── */}
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
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#6366f1', color: '#ffffff',
                        padding: '7px 13px', borderRadius: 9999, border: 'none',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                        flexShrink: 0, cursor: 'pointer',
                      }}
                    >
                      <Bell size={13} color="#fff" strokeWidth={2.5} />
                      <span>{notificationsList[notifIndex].badge}</span>
                    </button>

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].title}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].subtitle} · <span style={{ color: '#9CA3AF', fontWeight: 500 }}>{notificationsList[notifIndex].time}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: '#f3f4f6', borderRadius: 999, padding: '3px 6px' }}>
                      <button
                        onClick={() => setNotifIndex(prev => (prev > 0 ? prev - 1 : notificationsList.length - 1))}
                        title="Previous Notification"
                        style={{
                          width: 24, height: 24, borderRadius: '50%', border: 'none',
                          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#374151',
                        }}
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
                          cursor: 'pointer', color: '#374151',
                        }}
                      >
                        <ChevronDown size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── PROFILE EXPANDED ─── */}
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
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: 0,
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: '#ffffff', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)', flexShrink: 0
                      }}>
                        {(teacherName || user?.full_name || 'Babita Patel').substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                          {teacherName || user?.full_name || 'Babita Patel'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                          Academic Faculty Staff
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

        {/* ── Main Scrollable Container Box Card (Matching Admin & Student Dashboard) ── */}
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
