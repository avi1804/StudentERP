import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, CheckSquare, FileText, BookOpen, BarChart2,
  Search, Bell, User, Users, BookMarked, UserCheck, Megaphone, Calendar,
  ChevronUp, ChevronDown, LogOut, GraduationCap, Shield, ClipboardList, Sparkles
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { FacultyMobileTopBar } from "../../components/mobile/FacultyMobileTopBar";
import { FacultyMobileBottomNav } from "../../components/mobile/FacultyMobileBottomNav";
import { FacultyMobileDrawer } from "../../components/mobile/FacultyMobileDrawer";
import { useAuthStore } from "../../store/authStore";
import { apiClient as api } from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import GradualBlur from "../../components/GradualBlur";

export function FacultySidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      category: "ACADEMIC",
      items: [
        { to: "/faculty/dashboard", label: "Dashboard", icon: LayoutGrid, end: true },
        { to: "/faculty/attendance", label: "Attendance", icon: CheckSquare },
        { to: "/faculty/attendance/ai", label: "AI Attendance", icon: Sparkles },
        { to: "/faculty/attendance-report", label: "Attendance Reports", icon: FileText },
        { to: "/faculty/assignments", label: "Assignments", icon: ClipboardList },
        { to: "/faculty/marks", label: "Enter Marks", icon: BookOpen },
        { to: "/faculty/results", label: "View Results", icon: BarChart2 },
      ]
    },
    {
      category: "FACULTY",
      items: [
        { to: "/faculty/my-students", label: "My Students", icon: Users },
        { to: "/faculty/my-subjects", label: "My Subjects", icon: BookMarked },
        { to: "/faculty/assign-substitute", label: "Assign Substitute", icon: UserCheck },
      ]
    },
    {
      category: "COMMUNICATION",
      items: [
        { to: "/faculty/notices", label: "Notices", icon: Megaphone },
        { to: "/faculty/events", label: "Events", icon: Calendar },
      ]
    }
  ];

  return (
    <div
      className="premium-student-sidebar"
      style={{
        background: 'rgba(247, 245, 236, 0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(40, 43, 74, 0.12)',
        boxShadow: '0 10px 35px rgba(40, 43, 74, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '28px 24px 20px', flexShrink: 0 }}>
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
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#282B4A', margin: 0, letterSpacing: '-0.02em' }}>
            IndusERP
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(40, 43, 74, 0.7)', margin: '2px 0 0 0', fontWeight: 500 }}>Faculty Portal</p>
        </div>
      </div>

      <div className="nav-links" style={{ overflowY: 'auto', flex: 1, paddingBottom: '32px' }}>
        {navSections.map((sec, sIdx) => (
          <div key={sec.category} style={{ marginBottom: sIdx === navSections.length - 1 ? '0' : '8px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'rgba(40, 43, 74, 0.65)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: sIdx === 0 ? '12px 0 6px 16px' : '20px 0 6px 16px'
            }}>
              {sec.category}
            </div>

            {sec.items.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                >
                  <span className="nav-icon"><Icon size={19} /></span>
                  <span className="nav-text">{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
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

                    {/* Notification circle */}
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
                      {/* Unread dot */}
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#ef4444', border: '2px solid #EEEBDA',
                      }} />
                    </button>

                    {/* Profile circle */}
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
                    <Search size={18} color="#282B4A" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search subjects, students, marks..."
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
                        background: '#282B4A', color: '#EEEBDA',
                        padding: '7px 13px', borderRadius: 9999, border: 'none',
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                        flexShrink: 0, cursor: 'pointer',
                      }}
                    >
                      <Bell size={13} color="#EEEBDA" strokeWidth={2.5} />
                      <span>{notificationsList[notifIndex].badge}</span>
                    </button>

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#282B4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].title}
                      </div>
                      <div style={{ fontSize: 11, color: '#525677', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificationsList[notifIndex].subtitle} · <span style={{ color: '#7E82A4', fontWeight: 500 }}>{notificationsList[notifIndex].time}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: 'rgba(40, 43, 74, 0.08)', borderRadius: 999, padding: '3px 6px' }}>
                      <button
                        onClick={() => setNotifIndex(prev => (prev > 0 ? prev - 1 : notificationsList.length - 1))}
                        title="Previous Notification"
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
                        title="Next Notification"
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
                        background: 'linear-gradient(135deg, #282B4A, #3a3e68)',
                        color: '#EEEBDA', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(40, 43, 74, 0.25)', flexShrink: 0
                      }}>
                        {(teacherName || user?.full_name || 'Babita Patel').substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#282B4A', lineHeight: 1.2 }}>
                          {teacherName || user?.full_name || 'Babita Patel'}
                        </div>
                        <div style={{ fontSize: 11, color: '#525677', marginTop: 2 }}>
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
