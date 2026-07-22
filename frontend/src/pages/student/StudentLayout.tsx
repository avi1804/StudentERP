import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { 
  Home, User, CheckCircle, BookOpen, Calendar, 
  FileText, ClipboardList, Briefcase, Megaphone, 
  IdCard, Bell, Book, Building, Utensils, Wallet, 
  Settings, GraduationCap, Sparkles 
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileTopBar } from "../../components/mobile/MobileTopBar";
import { MobileBottomNav } from "../../components/mobile/MobileBottomNav";
import { motion, AnimatePresence } from "framer-motion";

export function StudentLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
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
        <MobileTopBar />
        <main className="m-content">
          <Outlet />
        </main>
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
      <div className="premium-student-sidebar">
        <div className="logo-area">
          <div className="logo-icon">
            <GraduationCap size={28} />
          </div>
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

      <div id="main" className="premium-main">
        <div id="topbar" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '32px 40px 10px', background: 'transparent', borderBottom: 'none', height: 'auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Search anything..." style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '24px', border: '1px solid #f3f4f6', background: '#fff', fontSize: '14px', outline: 'none', color: '#111827', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ position: 'relative', cursor: 'pointer', padding: '4px' }} 
                  onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  <div style={{ position: 'absolute', top: '0', right: '0', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>3</div>
                </div>

                <AnimatePresence>
                  {isNotificationDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{ position: 'absolute', top: 'calc(100% + 16px)', right: '-10px', width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', overflow: 'hidden', zIndex: 50 }}
                    >
                      <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>Notifications</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>Mark all read</div>
                      </div>
                      
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {/* Notification Item 1 */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #f9fafb', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s', background: '#f8fafc' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ClipboardList size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>New Assignment Added</div>
                            <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '4px', lineHeight: 1.4 }}>Prof. Sharma uploaded "Data Structures Assignment 3".</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 500 }}>2 hours ago</div>
                          </div>
                        </div>

                        {/* Notification Item 2 */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #f9fafb', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Wallet size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Fee Payment Reminder</div>
                            <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '4px', lineHeight: 1.4 }}>Your tuition fee 2nd installment is due next week.</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 500 }}>Yesterday</div>
                          </div>
                        </div>

                        {/* Notification Item 3 */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #f9fafb', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Bell size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Library Book Due</div>
                            <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '4px', lineHeight: 1.4 }}>"Introduction to Algorithms" is due for return tomorrow.</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 500 }}>2 days ago</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }} onClick={() => navigate('/dashboard/notices')}>View all notifications</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} title="Profile Options">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f9a8d4, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{user?.full_name || 'Student User'}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>B.Tech CSE - 4th Year</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '200px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', overflow: 'hidden', zIndex: 50 }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{user?.full_name || 'Student User'}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{user?.email || 'student@studenterp.com'}</div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <div 
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#ef4444', fontSize: '13px', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div id="content" style={{ paddingTop: '10px', paddingLeft: '40px', paddingRight: '40px', paddingBottom: '40px' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}
