import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { apiClient as api } from "../../api/axios";
import { 
  Home, User, CheckCircle, BookOpen, Calendar, 
  FileText, ClipboardList, Briefcase, Megaphone, 
  IdCard, Bell, Wallet, 
  Settings, GraduationCap, Search, X, LogOut,
  ChevronUp, ChevronDown
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileTopBar } from "../../components/mobile/MobileTopBar";
import { MobileBottomNav } from "../../components/mobile/MobileBottomNav";
import { motion, AnimatePresence } from "framer-motion";
import GradualBlur from "../../components/GradualBlur";

export function StudentLayout() {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [activeState, setActiveState] = useState<'idle' | 'search' | 'notifications' | 'profile'>('idle');
  const [notifIndex, setNotifIndex] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const [notificationsList, setNotificationsList] = useState<any[]>([
    { id: 1, type: 'Notice', badge: 'LIVE', title: 'Welcome to Student ERP', subtitle: 'Check notices section for latest updates', time: 'Just now' }
  ]);

  useEffect(() => {
    api.get('/notices/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map((n: any) => ({
            id: n.id,
            type: n.category || 'Notice',
            badge: n.category || 'NOTICE',
            title: n.title,
            subtitle: n.content.length > 60 ? n.content.substring(0, 60) + '...' : n.content,
            time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setNotificationsList(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch full student profile if missing in auth store
  useEffect(() => {
    if (!user?.full_name) {
      api.get('/student-dash/profile')
        .then(res => {
          if (res.data?.full_name && user) {
            setUser({ ...user, full_name: res.data.full_name, email: res.data.email || user.email });
          }
        })
        .catch(() => {});
    }
  }, [user]);

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

  useEffect(() => {
    document.body.classList.add('light-theme');
    return () => { document.body.classList.remove('light-theme'); };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
        <MobileTopBar />
        <main className="m-content"><Outlet /></main>
        <MobileBottomNav />
      </div>
    );
  }

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Attendance", path: "/dashboard/attendance", icon: CheckCircle },
    { name: "Subjects", path: "/dashboard/subjects", icon: BookOpen },
    { name: "Timetable", path: "/dashboard/timetable", icon: Calendar },
    { name: "Events", path: "/dashboard/events", icon: Calendar },
    { name: "Exams & Marks", path: "/dashboard/results", icon: FileText },
    { name: "Assignments", path: "/dashboard/assignments", icon: ClipboardList },
    { name: "Placement Cell", path: "/dashboard/placement", icon: Briefcase },
    { name: "Complaints", path: "/dashboard/complaints", icon: Megaphone },
    { name: "ID Card", path: "/dashboard/idcard", icon: IdCard },
    { name: "Notices", path: "/dashboard/notices", icon: Bell },
    { name: "Fee Management", path: "/dashboard/fees", icon: Wallet },
  ];

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: '#f4f5f8', position: 'relative' }}>
      {/* ── Fixed Sidebar Card (Left) ── */}
      <div 
        className="premium-student-sidebar" 
        style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '20px', 
          width: '280px',
          height: 'calc(100vh - 40px)', 
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          zIndex: 40,
          margin: 0,
        }}
      >
        <div className="logo-area">
          <div className="logo-icon"><GraduationCap size={28} /></div>
          <div className="logo-text">
            <h2>Student ERP</h2>
            <p>Learn. Manage. Grow.</p>
          </div>
        </div>
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/dashboard"}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <span className="nav-icon"><link.icon size={20} /></span>
              <span className="nav-text">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

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

              {/* ─── SEARCH EXPANDED: Dynamic Island morph (No X button, auto-closes on inactivity) ─── */}
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
                    placeholder="Search anything..."
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

              {/* ─── NOTIFICATION EXPANDED: Dynamic Island morph (No X button, auto-closes on inactivity) ─── */}
              {activeState === 'notifications' && (
                <motion.div
                  key="notification-expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    width: 440, height: 60,
                    padding: '0 16px', gap: 12,
                  }}
                >
                  {/* Green Highlighted Button / Badge (First) */}
                  <button
                    onClick={() => navigate('/dashboard/notices')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#10b981', color: '#ffffff',
                      padding: '7px 13px', borderRadius: 9999, border: 'none',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                      flexShrink: 0, cursor: 'pointer',
                      transition: 'transform 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Bell size={13} color="#fff" strokeWidth={2.5} />
                    <span>{notificationsList[notifIndex].badge}</span>
                  </button>

                  {/* Single Notification Content (Middle) */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {notificationsList[notifIndex].title}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {notificationsList[notifIndex].subtitle} · <span style={{ color: '#9CA3AF', fontWeight: 500 }}>{notificationsList[notifIndex].time}</span>
                    </div>
                  </div>

                  {/* Top & Down Switcher Buttons (Right) */}
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

              {/* ─── PROFILE EXPANDED: Dynamic Island morph (Display picture | Settings SVG | Logout SVG) ─── */}
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
                  {/* Display Picture Avatar (Clickable to MyProfile) */}
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    title="View Profile"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', padding: 0,
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      color: '#ffffff', fontWeight: 700, fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)', flexShrink: 0
                    }}>
                      {user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                        {user?.full_name || 'Student'}
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                        Student Profile
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
                      <LogOut size={17} strokeWidth={2} color="#EF4444" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        </div>{/* end navbarRef */}
      </div>

      {/* ── Main Professional White Box Container (Starts BELOW Dynamic Island, Scrolls ONLY Inside) ── */}
      <div
        style={{
          position: 'fixed',
          top: '84px',
          bottom: '20px',
          left: '320px',
          right: '20px',
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
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
