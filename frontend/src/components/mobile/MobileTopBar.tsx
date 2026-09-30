import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Menu, Bell, X, Home, User, CheckCircle, BookOpen, Calendar, 
  FileText, ClipboardList, Briefcase, Megaphone, IdCard, Wallet, 
  LogOut, GraduationCap, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';

export function MobileTopBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<{
    full_name?: string;
    enrollment_number?: string;
    branch?: string;
    semester?: number;
    profile_pic_url?: string;
  }>({});

  useEffect(() => {
    api.get('/student-dash/profile')
      .then(res => {
        if (res.data) setStudentProfile(res.data);
      })
      .catch(() => {});
  }, []);

  const displayName = studentProfile.full_name || user?.full_name || 'Harsh Rao';
  const displayEnrollment = studentProfile.enrollment_number || 'CS629';
  const displaySem = studentProfile.semester || 7;
  const initials = displayName.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          background: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 12px rgba(40, 43, 74, 0.03)',
        }}
      >
        {/* Left: Hamburger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            margin: '-4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#282B4A',
            borderRadius: '10px',
          }}
          aria-label="Open navigation menu"
        >
          <Menu size={22} strokeWidth={2.2} />
        </button>

        {/* Center: Brand Logo & Name */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#282B4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EEEBDA',
          }}>
            <GraduationCap size={18} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.4px' }}>
            IndusERP
          </span>
        </div>

        {/* Right: Bell & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate('/dashboard/notices')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              padding: '6px', 
              cursor: 'pointer', 
              color: '#282B4A', 
              display: 'flex', 
              alignItems: 'center', 
              position: 'relative' 
            }}
            aria-label="View notifications"
          >
            <Bell size={20} strokeWidth={2} />
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#ef4444',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: '2px solid #ffffff'
            }} />
          </button>

          <div
            onClick={() => navigate('/dashboard/profile')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #282B4A, #4a4e7e)',
              border: '1.5px solid rgba(40, 43, 74, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#EEEBDA',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(40, 43, 74, 0.1)',
            }}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* Slide Drawer Backdrop */}
      {isDrawerOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(40, 43, 74, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            transition: 'opacity 0.25s',
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          bottom: 0, 
          width: '82%', 
          maxWidth: '310px', 
          background: '#ffffff', 
          zIndex: 101, 
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)', 
          transition: 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)',
          boxShadow: '8px 0 32px rgba(40, 43, 74, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#282B4A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EEEBDA',
            }}>
              <GraduationCap size={20} />
            </div>
            <span style={{ fontSize: '19px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.4px' }}>
              IndusERP
            </span>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(false)} 
            style={{
              background: 'rgba(40, 43, 74, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#282B4A',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Card in Drawer */}
        <div 
          onClick={() => { setIsDrawerOpen(false); navigate('/dashboard/profile'); }}
          style={{
            margin: '16px 16px 8px',
            padding: '12px 14px',
            borderRadius: '16px',
            background: 'rgba(247, 245, 236, 0.85)',
            border: '1px solid rgba(40, 43, 74, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #282B4A, #3a3e68)',
            border: '1.5px solid rgba(40, 43, 74, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 800,
            color: '#EEEBDA',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {displayEnrollment} • {displaySem}th Semester
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ padding: '8px 12px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={() => setIsDrawerOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: '14px',
                background: isActive ? 'rgba(40, 43, 74, 0.08)' : 'transparent',
                color: isActive ? '#282B4A' : '#52525b',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <link.icon size={19} color="#282B4A" strokeWidth={1.8} />
              <span style={{ fontSize: '14px', flex: 1 }}>{link.name}</span>
              <ChevronRight size={14} color="#94a3b8" />
            </NavLink>
          ))}
        </div>
        
        {/* Logout Button */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 16px',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
