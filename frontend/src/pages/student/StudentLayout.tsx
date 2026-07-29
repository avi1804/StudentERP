import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { 
  Home, User, CheckCircle, BookOpen, Calendar, 
  FileText, ClipboardList, Briefcase, Megaphone, 
  IdCard, Bell, Wallet, 
  Settings, GraduationCap, Search, X, LogOut
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileTopBar } from "../../components/mobile/MobileTopBar";
import { MobileBottomNav } from "../../components/mobile/MobileBottomNav";
import { motion, AnimatePresence } from "framer-motion";

export function StudentLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [activeState, setActiveState] = useState<'idle' | 'search' | 'notifications' | 'profile'>('idle');
  const navbarRef = useRef<HTMLDivElement>(null);

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
    { name: "Exams & Marks", path: "/dashboard/results", icon: FileText },
    { name: "Assignments", path: "/dashboard/assignments", icon: ClipboardList },
    { name: "Placement Cell", path: "/dashboard/placement", icon: Briefcase },
    { name: "Complaints", path: "/dashboard/complaints", icon: Megaphone },
    { name: "ID Card", path: "/dashboard/idcard", icon: IdCard },
    { name: "Notices", path: "/dashboard/notices", icon: Bell },
    { name: "Fee Management", path: "/dashboard/fees", icon: Wallet },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* ── Sidebar ── */}
      <div className="premium-student-sidebar">
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

      {/* ── Main content area ── */}
      <div id="main" className="premium-main">

        {/* ── Top Bar ── */}
        <div
          id="topbar"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '28px 40px 16px',
            position: 'relative',
            zIndex: 50,
          }}
        >
          {/* Outer reference div for click-outside detection */}
          <div ref={navbarRef} style={{ position: 'relative' }}>

            {/* ── The pill / Dynamic Island capsule (SEARCH ONLY morphs) ── */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>

                {/* ─── IDLE STATE: three round buttons in an oval pill ─── */}
                {activeState !== 'search' && (
                  <motion.div
                    key="idle-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}
                  >
                    {/* Search circle */}
                    <button
                      onClick={() => setActiveState('search')}
                      title="Search"
                      style={{
                        width: 46, height: 46, borderRadius: '50%',
                        background: '#F5F5F5', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Search size={20} color="#333" strokeWidth={1.6} />
                    </button>

                    {/* Notification circle */}
                    <button
                      onClick={() => setActiveState(activeState === 'notifications' ? 'idle' : 'notifications')}
                      title="Notifications"
                      style={{
                        width: 46, height: 46, borderRadius: '50%',
                        background: '#F5F5F5', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bell size={20} color="#333" strokeWidth={1.6} />
                      {/* Unread dot */}
                      <span style={{
                        position: 'absolute', top: 9, right: 9,
                        width: 9, height: 9, borderRadius: '50%',
                        background: '#ef4444', border: '2px solid #F5F5F5',
                      }} />
                    </button>

                    {/* Profile circle */}
                    <button
                      onClick={() => setActiveState(activeState === 'profile' ? 'idle' : 'profile')}
                      title="Profile"
                      style={{
                        width: 46, height: 46, borderRadius: '50%',
                        background: '#F5F5F5', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'transform 0.18s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <User size={20} color="#333" strokeWidth={1.6} />
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
                      width: 400, height: 66,
                      padding: '0 16px', gap: 10,
                    }}
                  >
                    <Search size={19} color="#9CA3AF" strokeWidth={1.6} style={{ flexShrink: 0 }} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search anything..."
                      style={{
                        flex: 1, background: 'transparent',
                        border: 'none', outline: 'none',
                        fontSize: 15, fontWeight: 500,
                        color: '#111', fontFamily: 'Inter, sans-serif',
                        caretColor: '#555',
                      }}
                    />
                    <button
                      onClick={() => setActiveState('idle')}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#F3F4F6', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#E5E7EB')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#F3F4F6')}
                    >
                      <X size={13} color="#6B7280" strokeWidth={2.5} />
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>

            {/* ── Notification floating dropdown ── */}
            <AnimatePresence>
              {activeState === 'notifications' && (
                <motion.div
                  key="notif-panel"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 340,
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#111' }}>
                      <Bell size={14} strokeWidth={2} />Notifications
                    </div>
                    <button onClick={() => setActiveState('idle')} style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '50%', display: 'flex' }}>
                      <X size={14} color="#9CA3AF" />
                    </button>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {[
                      { icon: <ClipboardList size={14} />, bg: '#EEF2FF', ic: '#6366F1', title: 'Assignment Uploaded', desc: 'Prof. Sharma uploaded "Data Structures Assignment 3".', time: '2 hours ago' },
                      { icon: <CheckCircle size={14} />, bg: '#FFFBEB', ic: '#F59E0B', title: 'Attendance Updated', desc: 'Computer Networks attendance marked present.', time: 'Yesterday' },
                      { icon: <Bell size={14} />, bg: '#F0FDF4', ic: '#22C55E', title: 'New Circular Posted', desc: 'Library timings updated for the semester.', time: '2 days ago' },
                    ].map((n, i) => (
                      <div key={i}
                        style={{ padding: '12px 16px', borderBottom: '1px solid #fafafa', display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: n.bg, color: n.ic, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 2 }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginBottom: 3 }}>{n.desc}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 16px', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
                    <span onClick={() => navigate('/dashboard/notices')} style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', cursor: 'pointer' }}>View all notifications</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Profile floating dropdown ── */}
            <AnimatePresence>
              {activeState === 'profile' && (
                <motion.div
                  key="profile-panel"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 260,
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #f9a8d4, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{user?.full_name || 'Student User'}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>B.Tech CSE · 4th Year</div>
                    </div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    {[
                      { icon: <User size={15} />, label: 'My Profile', action: () => navigate('/dashboard/profile') },
                      { icon: <Settings size={15} />, label: 'Settings', action: () => navigate('/dashboard/settings') },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >{item.icon}{item.label}</button>
                    ))}
                    <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#ef4444', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><LogOut size={15} />Logout</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>{/* end navbarRef */}
        </div>

        {/* ── Page Content ── */}
        <div id="content" style={{ paddingTop: '40px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '40px' }}>
          <Outlet />
        </div>

      </div>
    </>
  );
}
