import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search, Bell, X, Home, User, CheckCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/results': 'Results',
  '/dashboard/profile': 'Profile',
};

export function MobileTopBar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const title = pageTitles[location.pathname] || 'StudentERP';
  const initials = user?.full_name?.substring(0, 2).toUpperCase() || 'ST';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Attendance", path: "/dashboard/attendance", icon: CheckCircle },
    { name: "Results", path: "/dashboard/results", icon: FileText },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #ECECEC',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        {/* Left: Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#222'
            }}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right: Search, Notification, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: '#222', display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </button>
          
          <button style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: '#222', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Bell size={20} />
            <div style={{ position: 'absolute', top: '2px', right: '4px', background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #fff' }} />
          </button>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* Slide Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, transition: 'opacity 0.3s' }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide Drawer */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          bottom: 0, 
          width: '280px', 
          background: '#FFFFFF', 
          zIndex: 101, 
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)', 
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '10px 0 30px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #ECECEC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f9a8d4, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#222' }}>{user?.full_name || 'Student User'}</div>
              <div style={{ fontSize: '12px', color: '#777' }}>B.Tech CSE</div>
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: '#777' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={() => setIsDrawerOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#F8F8F8' : 'transparent',
                color: isActive ? '#222' : '#777',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s'
              })}
            >
              <link.icon size={20} />
              <span style={{ fontSize: '15px' }}>{link.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid #ECECEC' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
